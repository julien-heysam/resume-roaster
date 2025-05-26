#!/bin/bash

echo "🚀 Resume Roaster - Production Setup"
echo "===================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

echo "📝 Creating .env.local file..."

# Create .env.local file
cat > .env.local << 'EOF'
# Supabase Configuration
# Replace [YOUR_DB_PASSWORD] with your actual Supabase database password
DATABASE_URL="postgresql://postgres....:[YOUR_DB_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres....:[YOUR_DB_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
SUPABASE_URL="h..."
SUPABASE_ANON_KEY="..."

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# AI Provider API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Other services
BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
EOF

echo "✅ .env.local file created!"
echo ""
echo "🔧 Next Steps:"
echo "1. Edit .env.local and replace [YOUR_DB_PASSWORD] with your Supabase database password"
echo "2. Add your API keys (ANTHROPIC_API_KEY, etc.)"
echo "3. Generate a NextAuth secret: openssl rand -base64 32"
echo "4. Run: npm run setup-db"
echo ""
echo "📖 For detailed instructions, see PRODUCTION_DEPLOYMENT.md" 