import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for RPC calls
);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  total: number;
  resetTime: string;
}

export async function checkAndIncrementUsage(ip: string): Promise<RateLimitResult> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const maxRequests = 3;
  
  try {
    // Increment usage and get new count
    const { data: newCount, error } = await supabase
      .rpc('increment_usage', { 
        _ip: ip, 
        _date: today 
      });
    
    if (error) {
      console.error('Rate limit error:', error);
      // On error, allow the request but log it
      return {
        allowed: true,
        remaining: maxRequests - 1,
        total: maxRequests,
        resetTime: getResetTime()
      };
    }
    
    const allowed = newCount <= maxRequests;
    const remaining = Math.max(0, maxRequests - newCount);
    
    return {
      allowed,
      remaining,
      total: maxRequests,
      resetTime: getResetTime()
    };
    
  } catch (error) {
    console.error('Rate limit exception:', error);
    // On exception, allow the request
    return {
      allowed: true,
      remaining: maxRequests - 1,
      total: maxRequests,
      resetTime: getResetTime()
    };
  }
}

export async function getCurrentUsage(ip: string): Promise<{ used: number; remaining: number }> {
  const today = new Date().toISOString().slice(0, 10);
  const maxRequests = 3;
  
  try {
    const { data: currentCount, error } = await supabase
      .rpc('get_usage', { 
        _ip: ip, 
        _date: today 
      });
    
    if (error) {
      console.error('Get usage error:', error);
      return { used: 0, remaining: maxRequests };
    }
    
    const used = Math.max(0, currentCount || 0);
    const remaining = Math.max(0, maxRequests - used);
    
    return { used, remaining };
    
  } catch (error) {
    console.error('Get usage exception:', error);
    return { used: 0, remaining: maxRequests };
  }
}

export async function resetUsageForPaidUser(ip: string, bonusCredits: number = 5): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('reset_usage_for_paid', { 
        _ip: ip, 
        _bonus_credits: bonusCredits 
      });
    
    if (error) {
      console.error('Reset usage error:', error);
    }
    
  } catch (error) {
    console.error('Reset usage exception:', error);
  }
}

function getResetTime(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

// Helper to get client IP address
export function getClientIP(request: Request): string {
  // Try various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback
  return 'unknown';
}
