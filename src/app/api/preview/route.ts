import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { toFile } from 'openai/uploads';
import { generateStylePrompt, DEFAULT_STYLE, isValidStyle } from '@/lib/styles';

export async function POST(request: NextRequest) {
  try {
    // Använd inbyggd FormData API istället för formidable
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawStyle = formData.get('style') as string || DEFAULT_STYLE;
    const style = isValidStyle(rawStyle) ? rawStyle : DEFAULT_STYLE;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validera filtyp
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      return NextResponse.json({
        error: `Filtyp inte stödd: ${file.type}. Använd JPEG, PNG eller WebP.`
      }, { status: 400 });
    }

    // Konvertera File till Buffer för OpenAI
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Få rätt filextension baserat på MIME-typ
    const getExtension = (mimeType: string) => {
      switch (mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
          return 'jpg';
        case 'image/png':
          return 'png';
        case 'image/webp':
          return 'webp';
        default:
          return 'jpg';
      }
    };
    
    // Skapa korrekt filnamn med rätt extension
    const extension = getExtension(file.type);
    const fileName = `image.${extension}`;
    
    // Använd toFile med korrekt filnamn och MIME-typ
    const imageFile = await toFile(buffer, fileName, { type: file.type });
    
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY! 
    });



    // GPT Image 1 med toFile - garanterat typ-säkert
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt: generateStylePrompt(style),
      size: '1024x1536',
      quality: 'low',
      n: 1
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from API');
    }
    
    // Hantera både URL och base64 format
    let imageUrl;
    if (response.data[0].url) {
      imageUrl = response.data[0].url;
    } else if (response.data[0].b64_json) {
      // Konvertera base64 till data URL
      imageUrl = `data:image/png;base64,${response.data[0].b64_json}`;
    } else {
      throw new Error('No image URL or base64 data returned');
    }
    
    return NextResponse.json({ url: imageUrl });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}