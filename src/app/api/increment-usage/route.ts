import { NextRequest, NextResponse } from 'next/server';
import { checkAndIncrementUsage, getClientIP } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const result = await checkAndIncrementUsage(clientIP);
    
    return NextResponse.json({
      success: true,
      used: result.total - result.remaining + 1,
      remaining: result.remaining,
      total: result.total
    });
    
  } catch (error) {
    console.error('Increment usage error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to increment usage',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
