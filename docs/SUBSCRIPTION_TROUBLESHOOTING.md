# Subscription Troubleshooting Guide

This guide helps troubleshoot subscription upgrade issues, particularly when they work locally but fail in production.

## Common Issues & Solutions

### 1. **Caching Issues (Most Common)**

**Symptoms:**
- Subscription updates work locally but not in production
- User still sees old subscription tier after upgrade
- Changes appear in database but not in UI

**Solutions:**

#### A. Clear Browser Cache
```bash
# Force refresh the subscription data
# In browser console:
sessionStorage.removeItem('subscription-data')
sessionStorage.removeItem('subscription-timestamp')
window.location.reload()
```

#### B. Use Debug Script
```bash
# Check current subscription status
node scripts/debug-subscription.js --email user@example.com

# Fix cache issues
node scripts/debug-subscription.js --email user@example.com --fix-cache
```

#### C. Force Refresh in Application
```javascript
// In React component
const { forceRefresh } = useSubscription()
await forceRefresh()
```

### 2. **Database Connection Issues**

**Symptoms:**
- Intermittent failures
- Timeouts during subscription updates
- Connection pool exhaustion

**Solutions:**

#### A. Check Database Connection
```bash
# Test database connectivity
node scripts/debug-subscription.js --email user@example.com
```

#### B. Verify Environment Variables
```bash
# Check if DATABASE_URL is properly set
echo $DATABASE_URL

# Check if connection pooling is configured
# In your .env file:
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20"
```

### 3. **Session Management Issues**

**Symptoms:**
- User appears logged in but subscription data doesn't load
- Authentication errors when fetching subscription

**Solutions:**

#### A. Check Session Configuration
```typescript
// Verify authOptions in src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  // ... other config
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}
```

#### B. Clear Session Data
```bash
# In browser console:
localStorage.clear()
sessionStorage.clear()
# Then sign out and sign back in
```

### 4. **Production Environment Differences**

**Symptoms:**
- Works in development but fails in production
- Different behavior between environments

**Solutions:**

#### A. Environment Variable Check
```bash
# Verify all required environment variables are set in production:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- STRIPE_SECRET_KEY (if using Stripe)
```

#### B. Check Deployment Configuration
```yaml
# For Vercel deployment
# vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Debugging Steps

### Step 1: Verify Database State
```bash
# Check user's current subscription in database
node scripts/debug-subscription.js --email user@example.com
```

### Step 2: Test API Endpoints
```bash
# Test subscription API directly
curl -H "Cookie: your-session-cookie" \
     -H "Cache-Control: no-cache" \
     https://your-domain.com/api/user/subscription
```

### Step 3: Check Admin Update
```bash
# Update user subscription via admin API
curl -X POST https://your-domain.com/api/admin/update-user-plan \
     -H "Content-Type: application/json" \
     -H "Cookie: admin-session-cookie" \
     -d '{
       "email": "user@example.com",
       "subscriptionTier": "PREMIUM"
     }'
```

### Step 4: Force Cache Refresh
```bash
# Use the debug script to fix cache issues
node scripts/debug-subscription.js --email user@example.com --fix-cache
```

## Production-Specific Fixes

### 1. **Add Cache Headers**
Ensure all subscription-related API routes have proper cache headers:

```typescript
// In API routes
response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
response.headers.set('Pragma', 'no-cache')
response.headers.set('Expires', '0')
```

### 2. **Database Transaction Consistency**
Use transactions for subscription updates:

```typescript
const updatedUser = await db.$transaction(async (tx) => {
  return await tx.user.update({
    where: { id: userId },
    data: updateData
  })
})
```

### 3. **Add Logging**
Enhanced logging for production debugging:

```typescript
console.log(`Updating subscription for ${user.email}:`, {
  from: user.subscriptionTier,
  to: newTier,
  timestamp: new Date().toISOString()
})
```

## Quick Fixes

### For Immediate Resolution:
1. **Force refresh subscription data:**
   ```bash
   node scripts/debug-subscription.js --email user@example.com --fix-cache
   ```

2. **Clear user's browser cache:**
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
   - Clear site data in browser settings

3. **Update subscription directly:**
   ```bash
   node scripts/update-user-plan.js --email user@example.com --tier PREMIUM --force
   ```

### For Long-term Prevention:
1. **Implement proper cache invalidation**
2. **Add subscription update events**
3. **Use database transactions**
4. **Add comprehensive logging**

## Monitoring & Alerts

### Set up monitoring for:
- Subscription API response times
- Database connection health
- Cache hit/miss rates
- Failed subscription updates

### Log Analysis:
```bash
# Search for subscription-related errors
grep -i "subscription" /var/log/app.log | grep -i "error"

# Check for database connection issues
grep -i "database" /var/log/app.log | grep -i "timeout\|error"
```

## Contact Support

If issues persist after following this guide:

1. **Gather Information:**
   - User email/ID
   - Expected vs actual subscription tier
   - Browser and device information
   - Timestamp of the issue

2. **Run Debug Script:**
   ```bash
   node scripts/debug-subscription.js --email user@example.com > debug-output.txt
   ```

3. **Check Logs:**
   - Application logs
   - Database logs
   - CDN/proxy logs

4. **Provide Details:**
   - Steps to reproduce
   - Debug script output
   - Relevant log entries
   - Environment (production/staging)

## Prevention Checklist

- [ ] Cache headers properly configured
- [ ] Database transactions used for updates
- [ ] Comprehensive logging in place
- [ ] Environment variables verified
- [ ] Session management working correctly
- [ ] API endpoints tested in production
- [ ] Monitoring and alerts configured
- [ ] Debug scripts available and tested 