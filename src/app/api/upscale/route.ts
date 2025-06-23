import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, scale = 4 } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 });
    }

    console.log('=== ESRGAN UPSCALING START ===');
    console.log('Image URL:', imageUrl);
    console.log('Scale:', scale);

    // Steg 1: Skapa prediction med standard API
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "c15c48c0e85a93f3d4e283ac6ca684ce180d94d1975783663c747e7bfa6f5e5c",
        input: {
          image: imageUrl,
          scale: scale
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Replicate API error:', errorText);
      return NextResponse.json({ error: `Replicate API error: ${response.statusText}` }, { status: 500 });
    }

    const prediction = await response.json();
    console.log('Prediction created:', prediction.id);

    // Steg 2: Poll för resultat
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 60 sekunder timeout

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        }
      });
      
      if (!pollResponse.ok) {
        console.error('Polling failed:', pollResponse.statusText);
        break;
      }
      
      result = await pollResponse.json();
      attempts++;
      
      console.log(`Polling attempt ${attempts}: ${result.status}`);
    }

    if (result.status === 'failed') {
      console.error('Upscaling failed:', result.error);
      return NextResponse.json({ error: 'Upscaling failed' }, { status: 500 });
    }

    if (result.status !== 'succeeded') {
      console.error('Upscaling timeout');
      return NextResponse.json({ error: 'Upscaling timeout' }, { status: 500 });
    }

    console.log('=== ESRGAN UPSCALING SUCCESS ===');
    console.log('Upscaled URL:', result.output);

    return NextResponse.json({ 
      upscaledUrl: result.output,
      originalUrl: imageUrl,
      scale: scale
    });

  } catch (error) {
    console.error('Upscaling error:', error);
    return NextResponse.json({ 
      error: 'Failed to upscale image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
