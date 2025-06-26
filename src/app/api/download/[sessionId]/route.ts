import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID krävs' },
        { status: 400 }
      );
    }

    // Validate that this is a paid order via Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return NextResponse.json(
        { error: 'Ogiltig order ID' },
        { status: 404 }
      );
    }

    // Check payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Betalning ej slutförd' },
        { status: 403 }
      );
    }

    // Check if this is a digital tier (has download access)
    const tier = session.metadata?.tier;
    if (!tier || (tier !== 'digital' && tier !== 'print')) {
      return NextResponse.json(
        { error: 'Ingen download-access för denna tier' },
        { status: 403 }
      );
    }

    // Get the file path from session metadata
    // After payment confirmation, file is moved from temp_orders/ to paid_orders/
    const fileName = session.metadata?.fileName;
    const filePath = fileName ? `paid_orders/${fileName}` : null;
    
    console.log('🔍 Session metadata:', session.metadata);
    console.log('🔍 Constructed filePath:', filePath);
    
    if (!filePath || !fileName) {
      console.error('❌ No fileName in session metadata:', session.metadata);
      return NextResponse.json(
        { error: 'Fil ej hittad i order-metadata' },
        { status: 404 }
      );
    }

    // Download file from R2
    let fileResponse;
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: filePath,
      });
      fileResponse = await s3Client.send(command);
    } catch (err) {
      console.error('R2 download error:', err);
      return NextResponse.json(
        { error: 'Fil kunde inte hämtas från lagring' },
        { status: 500 }
      );
    }

    if (!fileResponse.Body) {
      return NextResponse.json(
        { error: 'Tom fil' },
        { status: 500 }
      );
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const reader = fileResponse.Body.transformToWebStream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Get customer info for filename - use same logic as checkout
    const hasActualText = session.metadata?.hasActualText === 'true';
    const petName = hasActualText ? (session.metadata?.petName || 'pet') : 'husdjur';
    const style = session.metadata?.style || 'artwork';
    
    // Create descriptive filename
    const filename = `PetMemories_${petName}_${style}_${sessionId.slice(-8)}.png`;

    // Return file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'private, no-cache',
      },
    });

  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json(
      { error: 'Något gick fel vid nedladdning' },
      { status: 500 }
    );
  }
}