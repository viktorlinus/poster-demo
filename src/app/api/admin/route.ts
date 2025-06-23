import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    // Get recent Stripe payments with expanded customer_details
    const stripe = getServerStripe();
    const sessions = await stripe.checkout.sessions.list({
      limit: 50,
      expand: ['data.customer'], // This helps get more customer info
      created: {
        gte: Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000)
      }
    });
    
    // Get BOTH temp and paid R2 files
    const [paidObjects, tempObjects] = await Promise.all([
      s3Client.send(new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: 'paid_orders/'
      })),
      s3Client.send(new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: 'temp_orders/'
      }))
    ]);
    
    // Combine both file lists
    const allFiles = [
      ...(paidObjects.Contents || []),
      ...(tempObjects.Contents || [])
    ];
    
    // Match orders with files
    const ordersWithFiles = sessions.data.map((session) => {
      const orderId = session.metadata?.orderId;
      const fileName = session.metadata?.fileName;
      
      // Look for file by orderId or fileName in both locations
      const matchingFile = allFiles.find(file => 
        file.Key?.includes(orderId || 'no-match') || 
        file.Key?.includes(fileName || 'no-match')
      );
      
      // Determine shipping info for print orders
      let shippingInfo = null;
      
      if (session.metadata?.tier === 'print') {
        // Just use customer details - shipping might not be available in type
        if (session.customer_details?.address) {
          shippingInfo = {
            name: session.customer_details.name || 'Okänt namn',
            phone: session.customer_details.phone || 'Ej angivet',
            address: {
              line1: session.customer_details.address.line1,
              line2: session.customer_details.address.line2,
              city: session.customer_details.address.city,
              postal_code: session.customer_details.address.postal_code,
              country: session.customer_details.address.country,
            }
          };
        }
      }
      
      return {
        // Stripe data
        sessionId: session.id,
        paymentStatus: session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email,
        created: new Date(session.created * 1000).toISOString(),
        
        // Metadata
        orderId: session.metadata?.orderId,
        tier: session.metadata?.tier,
        petName: session.metadata?.petName,
        style: session.metadata?.style,
        fileName: session.metadata?.fileName,
        
        // Shipping info (improved logic)
        shipping: shippingInfo,
        
        // Simplified debug info
        debugShipping: {
          hasCustomerDetails: !!session.customer_details,
          hasCustomerAddress: !!session.customer_details?.address,
          tier: session.metadata?.tier,
          customerKeys: session.customer_details ? Object.keys(session.customer_details) : [],
          customerAddressKeys: session.customer_details?.address ? Object.keys(session.customer_details.address) : [],
        },
        
        // Enhanced file status
        fileExists: !!matchingFile,
        filePath: matchingFile?.Key,
        fileLocation: matchingFile?.Key?.startsWith('paid_orders/') ? 'paid' : 'temp',
        fileSize: matchingFile?.Size,
        fileModified: matchingFile?.LastModified,
        
        // Product info  
        productName: 'AI Poster' // Default since line_items might not be available
      };
    });
    
    return NextResponse.json({
      total: ordersWithFiles.length,
      orders: ordersWithFiles,
      debug: {
        paidFileCount: paidObjects.Contents?.length || 0,
        tempFileCount: tempObjects.Contents?.length || 0,
        totalFileCount: allFiles.length,
        samplePaidFile: paidObjects.Contents?.[0]?.Key,
        sampleTempFile: tempObjects.Contents?.[0]?.Key,
      }
    });
    
  } catch (error) {
    console.error('Admin dashboard error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: errorMessage }, 
      { status: 500 }
    );
  }
}
