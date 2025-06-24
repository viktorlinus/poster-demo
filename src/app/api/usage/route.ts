import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUsage, getClientIP } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const usage = await getCurrentUsage(clientIP);
    
    return NextResponse.json({
      used: usage.used,
      remaining: usage.remaining,
      total: 3,
      resetTime: getResetTime()
    });
    
  } catch (error) {
    console.error('Usage API Error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to get usage data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getResetTime(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}
