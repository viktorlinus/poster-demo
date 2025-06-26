import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event;

  try {
    const stripe = getServerStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'dummy_secret_for_testing'
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Invalid signature', details: errorMessage }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract order data from metadata
    const { tier, orderId, tempKey, petName, style } = session.metadata || {};
    
    console.log(`Payment completed for ${tier} tier, order ${orderId}`);
    
    // Save order to database (non-blocking)
    try {
      const { error } = await supabase.from('stripe_orders').insert({
        stripe_session_id: session.id,
        amount_sek: (session.amount_total || 0) / 100, // Stripe uses öre
        tier: tier || 'unknown',
        customer_email: session.customer_details?.email,
        pet_name: petName,
        style: style,
        order_id: orderId,
        status: 'completed'
      });

      if (error) {
        console.error('Database insert error (non-blocking):', error);
      } else {
        console.log(`Order ${orderId} saved to database`);
      }
    } catch (dbError) {
      console.error('Database error (non-blocking):', dbError);
      // Continue with normal processing even if DB fails
    }
    
    try {
      // Move file from temp_orders/ to paid_orders/
      const paidKey = `paid_orders/${orderId || 'unknown'}.png`;
      
      // Copy temp file to paid location
      await s3Client.send(new CopyObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        CopySource: `${process.env.R2_BUCKET_NAME}/${tempKey || ''}`,
        Key: paidKey,
      }));
      
      // Delete temp file
      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: tempKey || '',
      }));
      
      if (tier === 'digital') {
        await handleDigitalOrder(session, orderId || '', paidKey, petName || '');
      } else if (tier === 'print') {
        await handlePrintOrder(session, orderId || '', paidKey, petName || '', style || '');
      }
      
    } catch (storageError) {
      console.error('R2 storage error:', storageError);
      // Continue processing even if storage fails
    }
  }

  return NextResponse.json({ received: true });
}

async function handleDigitalOrder(session: Stripe.Checkout.Session, orderId: string, paidKey: string, petName: string) {
  console.log(`Digital order completed: ${orderId}`);
  console.log(`Customer: ${session.customer_details?.email}`);
  console.log(`Pet name: ${petName}`);
  console.log(`File location: ${paidKey}`);
  
  // TODO: Send email with download link
  // For now, just log the order details
}

async function handlePrintOrder(session: Stripe.Checkout.Session, orderId: string, paidKey: string, petName: string, style: string) {
  console.log(`Print order completed: ${orderId}`);
  console.log(`Customer: ${session.customer_details?.email}`);
  console.log(`Pet name: ${petName}, Style: ${style}`);
  console.log(`File for print processing: ${paidKey}`);
  
  // TODO: Email Viktor with order details for manual processing
  // For now, just log the order details
}
