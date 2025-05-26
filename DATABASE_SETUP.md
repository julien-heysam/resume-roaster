# Database Setup Guide

## 🗄️ Database & Caching System

Resume Roaster now includes a comprehensive database system for:
- **User Management** - Authentication and subscription tracking
- **Document Caching** - Avoid re-processing identical PDFs
- **Usage Tracking** - Monitor AI costs and user limits
- **Billing Integration** - Track usage for subscription billing

## 🔧 Setup Instructions

### 1. Database Setup (PostgreSQL)

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start  # Ubuntu

# Create database
createdb resume_roaster
```

**Option B: Supabase (Recommended)**
1. Visit [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the database URL from Settings > Database

### 2. Environment Variables

Create `.env.local` with:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/resume_roaster"
# Or Supabase URL:
# DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[db_name]"

# AI Provider API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# NextAuth.js (for authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Stripe (for billing - optional)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Open Prisma Studio to view data
npx prisma studio
```

## 📊 Database Schema

### Core Tables

**Users**
- Authentication and profile data
- Subscription tier (FREE/PRO/ENTERPRISE)
- Monthly usage tracking
- Billing information

**Documents**
- Cached PDF extraction results
- File hash for duplicate detection
- AI provider and cost tracking
- Processing metadata

**Usage Records**
- Detailed usage tracking per action
- Cost and credit consumption
- Monthly billing aggregation

**Invoices**
- Billing history and payments
- Stripe integration
- Usage period tracking

## 🚀 Key Features

### 1. **Document Caching**
```typescript
// Automatic duplicate detection
const fileHash = generateFileHash(buffer)
const existing = await DocumentService.findByHash(fileHash)

if (existing) {
  // Return cached result instantly
  return cachedResponse
}
```

### 2. **Usage Limits**
```typescript
// Check user's remaining roasts
const limits = await UserService.checkRoastLimit(userId)
if (!limits.canRoast) {
  return 'Limit exceeded'
}
```

### 3. **Cost Tracking**
```typescript
// Record every AI API call
await UsageService.recordUsage({
  userId,
  documentId,
  action: 'EXTRACT_PDF',
  cost: 0.02,
  creditsUsed: 1
})
```

## 💰 Subscription Tiers

| Tier | Monthly Roasts | Features |
|------|---------------|----------|
| **FREE** | 3 | Basic PDF extraction |
| **PRO** | 100 | Priority processing, history |
| **ENTERPRISE** | Unlimited | Custom features, API access |

## 🔄 Benefits

✅ **No Duplicate Processing** - Same PDF = Instant results  
✅ **Cost Optimization** - Track and minimize AI costs  
✅ **User Limits** - Enforce subscription boundaries  
✅ **Billing Ready** - Usage tracking for payments  
✅ **Analytics** - Monitor usage patterns  
✅ **Performance** - Cached results load instantly  

## 🛠️ API Updates

The PDF extraction endpoint now:
- Checks for cached documents first
- Validates user limits before processing
- Records usage and costs
- Supports anonymous and authenticated users

```typescript
// Usage example
FormData.append('userId', user.id)  // Optional
FormData.append('file', pdfFile)
FormData.append('provider', 'anthropic')
```

## 📈 Next Steps

1. **Set up database** (Local PostgreSQL or Supabase)
2. **Add environment variables**
3. **Run migrations** with `npx prisma db push`
4. **Test caching** by uploading the same PDF twice
5. **Monitor usage** with Prisma Studio

Your Resume Roaster now has enterprise-ready caching and billing capabilities! 🎉 