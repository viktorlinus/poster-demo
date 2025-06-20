export const runtime = 'nodejs'; // Krävs för Buffer-hantering

import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { toFile } from 'openai/uploads';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import { IncomingMessage } from 'http';

export async function POST(request: NextRequest) {
  try {
    // Konvertera NextRequest till Node.js IncomingMessage format
    const req = request as unknown as IncomingMessage;
    
    // Använd formidable för korrekt multipart-parsing
    const form = formidable({ multiples: false });
    
    const [, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const fileArray = files.file as formidable.File[];
    if (!fileArray || fileArray.length === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uploadedFile = fileArray[0];
    
    // Läs filen från tillfällig path
    const buffer = await fs.readFile(uploadedFile.filepath);
    
    // Använd toFile för korrekt TypeScript-typ
    const imageFile = await toFile(buffer, 'photo.png');
    
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY! 
    });

    // GPT Image 1 med toFile - garanterat typ-säkert
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt: 'Transform this baby photo into a delicate watercolor birth poster with soft pastel washes, white margins, and an artistic tender style suitable for a nursery. Make it look like a beautiful commemorative artwork.',
      size: '1024x1536',
      quality: 'low',
      n: 1
      // response_format stöds INTE av images.edit!
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from API');
    }

    return NextResponse.json({ url: response.data[0].url });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Log mer detaljer om felet
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}