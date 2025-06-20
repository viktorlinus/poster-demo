import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY! 
    });

    // GPT Image 1 med korrekt Buffer-typ och error handling
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: new File([buffer], 'image.png', { type: 'image/png' }),
      prompt: 'Transform this baby photo into a delicate watercolor birth poster with soft pastel washes, white margins, and an artistic tender style suitable for a nursery. Make it look like a beautiful commemorative artwork.',
      size: '1024x1536',
      quality: 'low',
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from API');
    }

    return NextResponse.json({ url: response.data[0].url });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}