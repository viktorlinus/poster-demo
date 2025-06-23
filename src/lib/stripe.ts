import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe utilities
export const getServerStripe = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerStripe should only be used on server-side');
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
  });
};

// Client-side Stripe loader
export const getStripe = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};
