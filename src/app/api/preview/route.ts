import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { toFile } from 'openai/uploads';
import { generateStylePrompt, DEFAULT_STYLE, isValidStyle } from '@/lib/styles';
import { checkAndIncrementUsage, getClientIP } from '@/lib/rate-limit';

// Cache för att undvika att beskriva samma bild flera gånger
const imageDescriptionCache: { [key: string]: string } = {};

function getImageCacheKey(file: File): string {
  // Använd filnamn + storlek som cache-nyckel
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const skipRateLimit = formData.get('skipRateLimit') === 'true';
    
    // Only check rate limit if not skipped
    if (!skipRateLimit) {
      const clientIP = getClientIP(request);
      const rateLimitResult = await checkAndIncrementUsage(clientIP);
      
      if (!rateLimitResult.allowed) {
        return NextResponse.json({
          error: 'Rate limit exceeded',
          message: `Du har använt dina 3 AI-genereringar för idag. Kom tillbaka imorgon så har du 3 nya! 🌅`,
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime
        }, { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.total.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime,
            'Retry-After': '86400' // 24 hours in seconds
          }
        });
      }
    }
    const file = formData.get('file') as File | null;
    const rawStyle = formData.get('style') as string || DEFAULT_STYLE;
    const style = isValidStyle(rawStyle) ? rawStyle : DEFAULT_STYLE;
    const customPrompt = formData.get('customPrompt') as string || null;
    const useVisionGenerate = formData.get('useVisionGenerate') === 'true';
    const quality = formData.get('quality') as 'low' | 'medium' | 'high' || 'low';

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

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY! 
    });

    let imageUrl;

    if (useVisionGenerate) {
      // NY STRATEGI: Vision + Generate
      
      // Steg 1: Kolla cache först
      const cacheKey = getImageCacheKey(file);
      let cachedDescription = imageDescriptionCache[cacheKey];
      
      if (!cachedDescription) {
        // Bara kör vision om vi inte har cachen
        console.log('=== KÖR VISION API (första gången för denna bild) ===');
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString('base64');
        const imageDataUrl = `data:${file.type};base64,${base64Image}`;

        const visionResponse = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [{
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: 'Describe this pet portrait image in detail for art generation. Focus on breed characteristics, coat patterns, distinctive features like eye color and markings, pose, and the personality shown in the expression. Be specific but artistic.' 
              },
              { 
                type: 'image_url', 
                image_url: { url: imageDataUrl } 
              }
            ]
          }],
          max_tokens: 300
        });

        cachedDescription = visionResponse.choices[0]?.message?.content || '';
        
        // Spara i cache
        imageDescriptionCache[cacheKey] = cachedDescription;
        
        console.log('Bildbeskrivning (cachad):');
        console.log(cachedDescription);
        console.log('=======================================');
      } else {
        console.log('=== ANVYÄNDER CACHAD BILDBESKRIVNING ===');
        console.log('(Sparar pengar och tid!)');
      }

      // Steg 3: Använd beskrivningen för att generera ny bild
      const finalPrompt = customPrompt || generateStylePrompt(style);
      const generatePrompt = `${cachedDescription} - Transform into ${finalPrompt}`;

      // Logga bara den slutliga prompten
      console.log(`=== GENERATE PROMPT ===`);
      console.log(generatePrompt);
      console.log('======================');

      const generateResponse = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: generatePrompt,
        size: '1024x1536',
        quality: quality,
        moderation: 'low', // Mindre restriktiva content filters
        n: 1
      });

      if (!generateResponse.data || generateResponse.data.length === 0) {
        throw new Error('No image data returned from generate API');
      }

      if (generateResponse.data[0].url) {
        imageUrl = generateResponse.data[0].url;
      } else if (generateResponse.data[0].b64_json) {
        imageUrl = `data:image/png;base64,${generateResponse.data[0].b64_json}`;
      } else {
        throw new Error('No image URL or base64 data returned from generate');
      }

      // Returnera med genererad prompt för debugging
      return NextResponse.json({ 
        url: imageUrl,
        generatedPrompt: generatePrompt, // Skicka tillbaka för debugging
        quality: quality // Visa vilken kvalitet som användes
      });

    } else {
      // GAMLA STRATEGIN: Edit
      const buffer = Buffer.from(await file.arrayBuffer());
      
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
      
      const extension = getExtension(file.type);
      const fileName = `image.${extension}`;
      const imageFile = await toFile(buffer, fileName, { type: file.type });

      const finalPrompt = customPrompt || generateStylePrompt(style);

      const response = await openai.images.edit({
        model: 'gpt-image-1',
        image: imageFile,
        prompt: finalPrompt,
        size: '1024x1536',
        quality: quality,
        n: 1
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No image data returned from edit API');
      }
      
      if (response.data[0].url) {
        imageUrl = response.data[0].url;
      } else if (response.data[0].b64_json) {
        imageUrl = `data:image/png;base64,${response.data[0].b64_json}`;
      } else {
        throw new Error('No image URL or base64 data returned from edit');
      }

      // Returnera utan genererad prompt för edit-metoden
      return NextResponse.json({ 
        url: imageUrl,
        quality: quality // Visa vilken kvalitet som användes
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
