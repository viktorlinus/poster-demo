# Stripe Setup Commands

## Install Dependencies
```bash
npm install stripe @aws-sdk/client-s3
```

## Environment Variables Setup
Add to `.env.local`:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=pet-posters
R2_PUBLIC_URL=https://your-domain.r2.cloudflarestorage.com

# App URL
NEXTJS_URL=http://localhost:3000

# Stripe Webhook Secret (after creating webhook)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe Account Setup
1. Go to https://dashboard.stripe.com
2. Get your test API keys
3. Create webhook endpoint pointing to: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`
