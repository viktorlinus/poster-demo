import { NextRequest, NextResponse } from 'next/server';
import { dataUrlToR2 } from '@/lib/r2-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('Save temp image - Starting...');
    
    // Hantera både JSON och FormData för mobil-kompatibilitet
    let posterDataUrl, metadata;
    
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // FormData från mobil
      const formData = await request.formData();
      posterDataUrl = formData.get('posterDataUrl') as string;
      const metadataStr = formData.get('metadata') as string;
      metadata = metadataStr ? JSON.parse(metadataStr) : {};
      console.log('Save temp image - FormData received, posterDataUrl length:', posterDataUrl?.length);
    } else {
      // JSON från desktop
      const body = await request.json();
      posterDataUrl = body.posterDataUrl;
      metadata = body.metadata;
      console.log('Save temp image - JSON received, posterDataUrl length:', posterDataUrl?.length);
    }
    
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
