# Stripe Setup Checklist

## 1. Get Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up/login to your account
3. Go to **Developers** → **API Keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

## 2. Set Environment Variables
Create `.env.local` in your project root:

```bash
# Stripe Keys (use test keys for development)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Optional: Set your app URL for redirects
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Test the Donation Flow
1. Start your app: `npm run dev`
2. Go to any lab page (e.g., `/labs/neuro-lab`)
3. Click "Donate Now"
4. Fill out donation form
5. Click "Continue to Payment"
6. You should be redirected to Stripe Checkout
7. Use test card: `4242 4242 4242 4242`
8. Use any future expiry date and any 3-digit CVC
9. Complete the test payment

## 4. Verify Success/Cancel URLs
- **Success**: Should redirect back to `/donate/[labId]?success=1`
- **Cancel**: Should redirect back to `/donate/[labId]?canceled=1`

## 5. Go Live (Production)
1. Switch to **Live mode** in Stripe Dashboard
2. Get your live keys (starts with `pk_live_` and `sk_live_`)
3. Update `.env.local` with live keys
4. Deploy with environment variables set on your hosting platform

## Test Cards for Development
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires 3D Secure**: `4000 0025 0000 3155`

## Troubleshooting
- **"Missing STRIPE_SECRET_KEY"**: Check your `.env.local` file
- **Checkout not loading**: Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- **Redirect issues**: Check `NEXT_PUBLIC_APP_URL` matches your domain


