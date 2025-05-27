# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for your Resume Roaster application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your application already running locally
3. Access to your `.env.local` file

## Step 1: Get Your Stripe Keys

1. Log into your Stripe Dashboard
2. Go to **Developers** > **API keys**
3. Copy your **Publishable key** and **Secret key** (use test keys for development)

## Step 2: Add Environment Variables

Add these variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

## Step 3: Create Products and Prices in Stripe

1. Go to **Products** in your Stripe Dashboard
2. Create the following products:

### Pro Plan
- **Name**: Resume Roaster Pro
- **Description**: Best for active job seekers
- Create two prices:
  - Monthly: $9.99/month (recurring)
  - Yearly: $99.99/year (recurring)

### Enterprise Plan
- **Name**: Resume Roaster Enterprise
- **Description**: For teams and career services
- Create two prices:
  - Monthly: $49.99/month (recurring)
  - Yearly: $499.99/year (recurring)

## Step 4: Add Price IDs to Environment Variables

After creating the prices, copy their IDs and add them to your `.env.local`:

```bash
# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_PRO_MONTHLY_PRICE_ID="price_your_pro_monthly_price_id"
STRIPE_PRO_YEARLY_PRICE_ID="price_your_pro_yearly_price_id"
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID="price_your_enterprise_monthly_price_id"
STRIPE_ENTERPRISE_YEARLY_PRICE_ID="price_your_enterprise_yearly_price_id"

# Public Stripe Price IDs (for frontend)
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID="price_your_pro_monthly_price_id"
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID="price_your_pro_yearly_price_id"
NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID="price_your_enterprise_monthly_price_id"
NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID="price_your_enterprise_yearly_price_id"
```

## Step 5: Set Up Webhooks

1. Go to **Developers** > **Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook` (for production) or use ngrok for local testing
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Step 6: Configure Stripe Customer Portal

1. Go to **Settings** > **Billing** > **Customer portal**
2. Enable the customer portal
3. Configure the settings:
   - Allow customers to update payment methods
   - Allow customers to view invoices
   - Allow customers to cancel subscriptions
   - Set your business information

## Step 7: Test the Integration

1. Restart your development server: `npm run dev`
2. Go to `/pricing` in your application
3. Try subscribing to a plan using Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Step 8: Local Webhook Testing (Optional)

For local development, you can use Stripe CLI to forward webhooks:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook signing secret from the CLI output to your `.env.local`

## Production Deployment

When deploying to production:

1. Replace test keys with live keys
2. Update webhook endpoint URL to your production domain
3. Ensure all environment variables are set in your hosting platform
4. Test the integration thoroughly

## Features Included

✅ **Subscription Management**: Users can subscribe to Pro and Enterprise plans
✅ **Payment Processing**: Secure payment handling via Stripe Checkout
✅ **Customer Portal**: Users can manage their subscriptions, update payment methods
✅ **Webhook Handling**: Automatic subscription status updates
✅ **Invoice Tracking**: Automatic invoice creation and tracking
✅ **Express Checkout**: Apple Pay, Google Pay, and PayPal support
✅ **Usage Limits**: Automatic enforcement based on subscription tier

## API Endpoints Created

- `POST /api/stripe/create-checkout-session` - Create a checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/create-portal-session` - Create customer portal session

## Database Integration

The integration automatically:
- Creates Stripe customers for users
- Updates user subscription tiers
- Tracks subscription status and billing periods
- Creates invoice records
- Enforces usage limits based on subscription tier

## Support

If you encounter any issues:
1. Check the Stripe Dashboard for payment details
2. Review webhook logs for any failed events
3. Check your application logs for errors
4. Ensure all environment variables are correctly set

## Security Notes

- Never expose your secret key in client-side code
- Always validate webhook signatures
- Use HTTPS in production
- Regularly rotate your API keys 