import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Check authentication using same system as admin dashboard
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.length !== 64) { // Same validation as admin auth
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const stripe = getServerStripe();
    
    // Get all successful payment sessions from last 30 days
    const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    
    console.log('🔍 Fetching print orders from:', new Date(thirtyDaysAgo * 1000));
    
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: thirtyDaysAgo },
      status: 'complete'
    });
    
    console.log('📊 Total sessions found:', sessions.data.length);
    console.log('🖨️ Print sessions:', sessions.data.filter(s => s.metadata?.tier === 'print').length);

    // Get fulfillment status from database
    const { data: fulfillmentData, error: fulfillmentError } = await supabase
      .from('fulfillment_status')
      .select('*');
    
    if (fulfillmentError) {
      console.error('Error fetching fulfillment status:', fulfillmentError);
    }
    
    // Create a map for quick lookup
    const fulfillmentMap = new Map();
    fulfillmentData?.forEach(item => {
      fulfillmentMap.set(item.session_id, item);
    });

    // Filter for print orders only
    const printOrders = sessions.data
      .filter(session => session.metadata?.tier === 'print')
      .map(session => {
        const fulfillment = fulfillmentMap.get(session.id);
        
        // Parse shipping address - use same logic as admin dashboard
        let shipping = null;
        try {
          if (session.metadata?.tier === 'print') {
            // Use customer_details.address instead of shipping_details
            if (session.customer_details?.address) {
              shipping = {
                name: session.customer_details.name || 'Okänt namn',
                phone: session.customer_details.phone || 'Ej angivet',
                address: {
                  line1: session.customer_details.address.line1 || '',
                  line2: session.customer_details.address.line2,
                  city: session.customer_details.address.city || '',
                  postal_code: session.customer_details.address.postal_code || '',
                  country: session.customer_details.address.country || 'SE'
                }
              };
            }
          }
        } catch (shippingError) {
          console.error('⚠️ Shipping parse error for session', session.id, shippingError);
        }

        return {
          sessionId: session.id,
          orderId: session.metadata?.orderId || session.id,
          customerEmail: session.customer_details?.email || 'Okänd email',
          created: new Date(session.created * 1000).toISOString(),
          amount: session.amount_total || 0,
          petName: session.metadata?.petName || 'Okänt husdjur',
          style: session.metadata?.style || 'watercolor',
          fileName: session.metadata?.fileName || 'Okänd fil',
          fileExists: !!session.metadata?.fileName,
          filePath: session.metadata?.fileName ? `paid_orders/${session.metadata.fileName}` : '',
          shipping,
          fulfillmentStatus: fulfillment?.status || 'pending',
          gelatoOrderId: fulfillment?.gelato_order_id,
          trackingNumber: fulfillment?.tracking_number,
          notes: fulfillment?.notes
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    return NextResponse.json({ printOrders });

  } catch (error) {
    console.error('Error fetching print orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch print orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication using same system as admin dashboard
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.length !== 64) { // Same validation as admin auth
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { sessionId, status, gelatoOrderId, trackingNumber, notes } = await request.json();

    if (!sessionId || !status) {
      return NextResponse.json({ error: 'Missing sessionId or status' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['pending', 'uploaded', 'printed', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update fulfillment status in database
    const { data, error } = await supabase
      .from('fulfillment_status')
      .upsert({
        session_id: sessionId,
        order_id: sessionId.split('_')[1] || sessionId, // Extract order ID if possible
        status,
        gelato_order_id: gelatoOrderId,
        tracking_number: trackingNumber,
        notes,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      })
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update database', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Updated fulfillment status for ${sessionId}: ${status}`);

    return NextResponse.json({ 
      success: true, 
      sessionId, 
      status,
      data: data[0],
      message: 'Fulfillment status updated successfully'
    });

  } catch (error) {
    console.error('Error updating fulfillment status:', error);
    return NextResponse.json(
      { error: 'Failed to update fulfillment status' },
      { status: 500 }
    );
  }
}
