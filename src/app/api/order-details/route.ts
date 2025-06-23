import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }
    
    // Retrieve session from Stripe
    const stripe = getServerStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return NextResponse.json({
      orderId: session.metadata?.orderId,
      tier: session.metadata?.tier,
      amount: session.amount_total,
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      petName: session.metadata?.petName,
    });
    
  } catch (error) {
    console.error('Order details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' }, 
      { status: 500 }
    );
  }
}
