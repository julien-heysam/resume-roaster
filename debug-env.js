#!/usr/bin/env node

// Debug script to check environment variables without exposing values
console.log('🔍 Checking Stripe environment variables...\n')

const envVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_MONTHLY_PRICE_ID',
  'STRIPE_PRO_YEARLY_PRICE_ID',
  'STRIPE_ENTERPRISE_MONTHLY_PRICE_ID',
  'STRIPE_ENTERPRISE_YEARLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID'
]

let allSet = true

envVars.forEach(varName => {
  const value = process.env[varName]
  const isSet = value && value !== '' && !value.includes('your_') && !value.includes('_here')
  
  if (isSet) {
    console.log(`✅ ${varName}: Set (${value.substring(0, 8)}...)`)
  } else {
    console.log(`❌ ${varName}: Not set or placeholder`)
    allSet = false
  }
})

console.log('\n' + '='.repeat(50))

if (allSet) {
  console.log('🎉 All Stripe environment variables are properly configured!')
  console.log('You should be able to use the payment system now.')
} else {
  console.log('⚠️  Some environment variables need to be configured.')
  console.log('\n📋 Next steps:')
  console.log('1. Go to https://dashboard.stripe.com/test/apikeys')
  console.log('2. Copy your API keys and replace the placeholder values in .env.local')
  console.log('3. Create products and prices in Stripe Dashboard')
  console.log('4. Copy the price IDs and update them in .env.local')
  console.log('5. Restart your development server')
}

console.log('\n📖 For detailed setup instructions, see STRIPE_SETUP.md') 