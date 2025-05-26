# Production Deployment Guide

## 🚀 Moving from Local Dev to Production

This guide will help you deploy your Resume Roaster application to production using **Supabase** for the database and **Vercel** for hosting.

## 📋 Prerequisites

- [Supabase Account](https://supabase.com)
- [Vercel Account](https://vercel.com)
- Your Supabase project credentials (provided)

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Get Your Database Password

You'll need to get your database password from Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Copy your database password (you set this when creating the project)

### 1.2 Update Environment Variables

Create a `.env.local` file in your project root with these variables:

```bash
# Supabase Configuration
DATABASE_URL="postgresql://postgres.diqoisiybzbsjcqdylbp:[YOUR_DB_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.diqoisiybzbsjcqdylbp:[YOUR_DB_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://diqoisiybzbsjcqdylbp.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcW9pc2l5Ynpic2pjcWR5bGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTM3MzEsImV4cCI6MjA2Mzg2OTczMX0.3qrsnZppOD_G8HmG1mZ5oZWPCK-WY-ST1Wlz71L54VA"

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000  # Will be updated for production
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
```

**Important:** Replace `[YOUR_DB_PASSWORD]` with your actual Supabase database password.

### 1.3 Deploy Database Schema

Run these commands to set up your database schema in Supabase:

```bash
# Generate Prisma client
npx prisma generate

# Deploy schema to Supabase
npx prisma db push

# Optional: Seed data if you have any
npx prisma db seed
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2.2 Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure Environment Variables in Vercel:**
   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**
   - Add all the environment variables from your `.env.local` file
   - **Important:** Update `NEXTAUTH_URL` to your Vercel domain (e.g., `https://your-app-name.vercel.app`)

### 2.3 Deploy via CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to configure your project
```

## 🔧 Step 3: Configure Production Settings

### 3.1 Update NextAuth URL

In your Vercel environment variables, set:
```bash
NEXTAUTH_URL=https://your-actual-vercel-domain.vercel.app
```

### 3.2 Configure OAuth Redirects (if using)

Update your OAuth provider settings:

**Google OAuth:**
- Add `https://your-domain.vercel.app/api/auth/callback/google` to authorized redirect URIs

**GitHub OAuth:**
- Add `https://your-domain.vercel.app/api/auth/callback/github` to authorization callback URL

### 3.3 Test Your Deployment

1. Visit your Vercel URL
2. Test user registration/login
3. Test PDF upload and processing
4. Check that all features work correctly

## 🔒 Step 4: Security & Performance

### 4.1 Environment Variables Checklist

Ensure these are set in Vercel:
- ✅ `DATABASE_URL`
- ✅ `DIRECT_URL`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `NEXTAUTH_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `ANTHROPIC_API_KEY`

### 4.2 Database Security

Your Supabase database is already configured with:
- Row Level Security (RLS) policies
- Connection pooling
- SSL encryption

### 4.3 Performance Optimization

The application is configured for:
- Edge runtime for API routes
- Optimized Prisma connection pooling
- Efficient file processing

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Verify your database password is correct
   - Check that `DATABASE_URL` and `DIRECT_URL` are properly set

2. **NextAuth Errors:**
   - Ensure `NEXTAUTH_URL` matches your Vercel domain
   - Verify `NEXTAUTH_SECRET` is set

3. **Build Failures:**
   - Check that all required environment variables are set in Vercel
   - Verify Prisma client generation works

4. **API Timeouts:**
   - Vercel functions have a 10-second timeout on hobby plan
   - Consider upgrading to Pro for longer timeouts

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and usage

### Supabase Monitoring
- Check database usage in Supabase dashboard
- Monitor API requests and performance

## 🎉 You're Live!

Your Resume Roaster application is now running in production with:
- ✅ Supabase PostgreSQL database
- ✅ Vercel hosting and serverless functions
- ✅ Secure authentication
- ✅ AI-powered PDF processing
- ✅ Scalable architecture

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Check Supabase logs
3. Verify all environment variables are correctly set
4. Test locally with production environment variables 