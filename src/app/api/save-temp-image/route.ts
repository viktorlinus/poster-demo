import { NextRequest, NextResponse } from 'next/server';
import { dataUrlToR2 } from '@/lib/r2-storage';

export async function POST(request: NextRequest) {
  try {
    const { posterDataUrl, metadata } = await request.json();
    
    if (!posterDataUrl) {
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
    await dataUrlToR2(posterDataUrl, tempKey);
    
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
