import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { dataUrlToR2 } from '@/lib/r2-storage';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const { tier, posterDataUrl, metadata } = await request.json();
    
    if (!posterDataUrl || !tier) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }
    
    // Define pricing based on your memory files
    const prices = {
      digital: {
        amount: 7900, // 79kr in öre
        name: 'AI-Poster Digital',
        description: 'Högupplöst digital fil för hemutskrift'
      },
      print: {
        amount: 29900, // 299kr in öre  
        name: 'AI-Poster Print',
        description: '30x45cm Premium Matt + Digital fil inkluderad'
      }
    };

    if (!prices[tier as keyof typeof prices]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const price = prices[tier as keyof typeof prices];

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create descriptive filename based on whether text was actually used
    const hasActualText = metadata?.hasText && metadata?.petName && metadata.petName.trim().length > 0;
    const petNameForFile = hasActualText ? metadata.petName.trim() : 'husdjur';
    const descriptiveFileName = `${petNameForFile}_${metadata?.style || 'watercolor'}_${orderId}.png`;
    
    // Save poster to R2 as temp file
    const tempKey = `temp_orders/${descriptiveFileName}`;
    await dataUrlToR2(posterDataUrl, tempKey);
    
    // Create Stripe Checkout Session
    const stripe = getServerStripe();
    
    // Base configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `${price.name} - ${hasActualText ? metadata.petName : 'Husdjur'} (${metadata?.style || 'watercolor'})`,
              description: `${price.description} | Order: ${orderId} | Fil: ${descriptiveFileName}`,
            },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/`,
      metadata: {
        tier,
        orderId,
        tempKey,
        fileName: descriptiveFileName,
        petName: hasActualText ? metadata.petName : 'Husdjur',
        hasActualText: hasActualText,
        style: metadata?.style || 'watercolor',
        timestamp: new Date().toISOString(),
      },
    };
    
    // Add shipping address collection for print orders only
    if (tier === 'print') {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['SE', 'NO', 'DK', 'FI', 'DE', 'US', 'GB', 'FR', 'ES', 'IT', 'NL', 'BE', 'AU', 'CA', 'JP'], // Major markets
      };
      sessionConfig.phone_number_collection = {
        enabled: true,
      };
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      sessionId: session.id,
      orderId 
    });
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage }, 
      { status: 500 }
    );
  }
}
