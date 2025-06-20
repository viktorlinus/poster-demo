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

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: buffer as any, // TypeScript workaround for Buffer type
      prompt: 'Delicate watercolor birth poster of the uploaded newborn photo, soft pastel washes, white margins',
      size: '1024x1536',
      quality: 'low',
      response_format: 'url',
    });

    return NextResponse.json({ url: response.data[0].url });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}