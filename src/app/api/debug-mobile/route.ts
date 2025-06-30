import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🔥 DEBUG MOBILE - Request received!');
  console.log('🔥 Headers:', Object.fromEntries(request.headers.entries()));
  console.log('🔥 URL:', request.url);
  console.log('🔥 Method:', request.method);
  
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('🔥 Content-Type:', contentType);
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      console.log('🔥 JSON Body keys:', Object.keys(body));
      console.log('🔥 Has posterDataUrl:', !!body.posterDataUrl);
      console.log('🔥 PosterDataUrl length:', body.posterDataUrl?.length);
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      console.log('🔥 FormData keys:', Array.from(formData.keys()));
      const posterDataUrl = formData.get('posterDataUrl');
      console.log('🔥 FormData posterDataUrl length:', posterDataUrl?.toString().length);
    } else {
      console.log('🔥 Unknown content type, reading as text...');
      const text = await request.text();
      console.log('🔥 Text length:', text.length);
      console.log('🔥 Text preview:', text.substring(0, 100));
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Debug endpoint reached successfully!',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔥 DEBUG ERROR:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
