import { NextRequest, NextResponse } from 'next/server';
import { dataUrlToR2 } from '@/lib/r2-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('Save temp image - Starting...');
    const { posterDataUrl, metadata } = await request.json();
    console.log('Save temp image - Data received, posterDataUrl length:', posterDataUrl?.length);
    
    if (!posterDataUrl) {
      console.log('Save temp image - Missing posterDataUrl');
      return NextResponse.json({ error: 'Missing posterDataUrl' }, { status: 400 });
    }
    
    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create descriptive filename based on whether text was actually used
    const hasActualText = metadata?.hasText && metadata?.petName && metadata.petName.trim().length > 0;
    const petNameForFile = hasActualText ? metadata.petName.trim() : 'husdjur';
    const descriptiveFileName = `${petNameForFile}_${metadata?.style || 'watercolor'}_${orderId}.png`;
    
    // Save poster to R2 as temp file
    const tempKey = `temp_orders/${descriptiveFileName}`;
    console.log('Save temp image - Saving to R2 with key:', tempKey);
    await dataUrlToR2(posterDataUrl, tempKey);
    console.log('Save temp image - Successfully saved to R2');
    
    return NextResponse.json({ 
      tempKey,
      orderId,
      fileName: descriptiveFileName
    });
    
  } catch (error) {
    console.error('Save temp image error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to save image', details: errorMessage }, 
      { status: 500 }
    );
  }
}
