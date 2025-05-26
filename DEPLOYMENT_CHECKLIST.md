# 🚀 Production Deployment Checklist

## Pre-Deployment Setup

### ✅ Environment Configuration
- [ ] Get Supabase database password from your project settings
- [ ] Run `npm run setup-env` to create `.env.local`
- [ ] Replace `[YOUR_DB_PASSWORD]` in `.env.local` with actual password
- [ ] Add your `ANTHROPIC_API_KEY` to `.env.local`
- [ ] Generate and add `NEXTAUTH_SECRET` (run: `openssl rand -base64 32`)

### ✅ Database Setup
- [ ] Run `npm run setup-db` to deploy schema to Supabase
- [ ] Verify database connection works locally
- [ ] Test user registration and login locally

### ✅ Code Preparation
- [ ] Commit all changes to Git
- [ ] Push to GitHub repository
- [ ] Ensure all features work in local development

## Vercel Deployment

### ✅ Vercel Project Setup
- [ ] Create new project on [vercel.com](https://vercel.com)
- [ ] Import your GitHub repository
- [ ] Configure environment variables in Vercel dashboard

### ✅ Environment Variables in Vercel
Copy these from your `.env.local` to Vercel:
- [ ] `DATABASE_URL`
- [ ] `DIRECT_URL`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `NEXTAUTH_SECRET`
- [ ] `ANTHROPIC_API_KEY`
- [ ] Update `NEXTAUTH_URL` to your Vercel domain

### ✅ OAuth Configuration (if using)
- [ ] Update Google OAuth redirect URIs
- [ ] Update GitHub OAuth callback URLs
- [ ] Test OAuth login flows

## Post-Deployment Testing

### ✅ Core Functionality
- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Upload and process a PDF resume
- [ ] Verify AI analysis works
- [ ] Test all main features

### ✅ Performance & Monitoring
- [ ] Enable Vercel Analytics
- [ ] Check Supabase usage dashboard
- [ ] Monitor function execution times
- [ ] Test from different devices/browsers

## Production Monitoring

### ✅ Ongoing Maintenance
- [ ] Set up error monitoring
- [ ] Monitor database usage
- [ ] Track API costs (Anthropic/OpenAI)
- [ ] Regular security updates

---

## Quick Commands

```bash
# Setup environment
npm run setup-env

# Setup database
npm run setup-db

# Test locally
npm run dev

# Deploy to Vercel (if using CLI)
npm run deploy
```

## Need Help?

- 📖 See `PRODUCTION_DEPLOYMENT.md` for detailed instructions
- 🐛 Check Vercel function logs for errors
- 📊 Monitor Supabase dashboard for database issues
- 🔑 Verify all environment variables are set correctly 