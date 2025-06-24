import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUsage, getClientIP } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const usage = await getCurrentUsage(clientIP);
    const maxRequests = 3;
    
    const allowed = usage.used < maxRequests;
    const remaining = Math.max(0, maxRequests - usage.used);
    
    return NextResponse.json({
      allowed,
      remaining,
      total: maxRequests,
      message: allowed ? null : `Du har använt dina 3 AI-genereringar för idag. Kom tillbaka imorgon så har du 3 nya! 🌅`
    });
    
  } catch (error) {
    console.error('Rate limit check error:', error);
    
    // On error, allow the request
    return NextResponse.json({
      allowed: true,
      remaining: 3,
      total: 3,
      message: null
    });
  }
}
