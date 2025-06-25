import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PetAdmin2025!';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Generate a simple token
      const token = crypto.randomBytes(32).toString('hex');
      
      // In production, you'd store this in a database or cache
      // For now, we'll use a simple approach
      
      return NextResponse.json({ 
        success: true, 
        token,
        message: 'Inloggning lyckades' 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Fel lösenord' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Server fel' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Simple token validation
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Ingen token' },
      { status: 401 }
    );
  }

  // In a real app, you'd validate the token against a database
  // For now, just check if it exists and looks valid
  const token = authHeader.split(' ')[1];
  
  if (token && token.length === 64) { // Simple hex token check
    return NextResponse.json({ 
      success: true, 
      message: 'Token giltig' 
    });
  } else {
    return NextResponse.json(
      { success: false, message: 'Ogiltig token' },
      { status: 401 }
    );
  }
}