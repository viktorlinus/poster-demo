import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }
    
    // Verify payment with Stripe
    const stripe = getServerStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }
    
    // Extract metadata
    const { tier, orderId, tempKey, petName, style, fileName } = session.metadata!;
    
    try {
      // Move file from temp_orders/ to paid_orders/ (keep same descriptive filename)
      const paidKey = `paid_orders/${fileName}`;
      
      console.log(`Moving file: ${tempKey} → ${paidKey}`);
      
      // Copy temp file to paid location
      await s3Client.send(new CopyObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        CopySource: `${process.env.R2_BUCKET_NAME}/${tempKey}`,
        Key: paidKey,
      }));
      
      // Delete temp file
      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: tempKey,
      }));
      
      console.log(`✅ Payment confirmed for ${tier}: ${fileName}`);
      
      return NextResponse.json({
        success: true,
        orderId,
        tier,
        fileName,
        petName,
        style,
        downloadUrl: paidKey // For future download link generation
      });
      
    } catch (storageError) {
      console.error('R2 storage error:', storageError);
      return NextResponse.json({
        success: true, // Payment still succeeded
        orderId,
        error: 'File processing failed, contact support'
      });
    }
    
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' }, 
      { status: 500 }
    );
  }
}
