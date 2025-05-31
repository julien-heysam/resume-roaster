# User Plan Management

This guide explains how to manually update user subscription plans in Resume Roaster.

## Overview

Users have subscription tiers that control their access to features:

- **FREE**: 5 roasts per month
- **PLUS**: 100 roasts per month + premium features
- **PREMIUM**: Unlimited roasts + all features

When changing plans, you may need to update several database fields and reset usage counters.

## Database Fields Updated

When switching a user's plan, the following fields are updated:

### Required Fields
- `subscriptionTier`: The new plan tier (`FREE`, `PRO`, `ENTERPRISE`)
- `updatedAt`: Timestamp of the change

### Optional Fields
- `subscriptionId`: Stripe subscription ID (for paid plans)
- `customerId`: Stripe customer ID (for billing)
- `subscriptionEndsAt`: When the subscription expires (optional)

### Usage Tracking
- `monthlyRoasts`: Reset to 0 when downgrading or when requested
- `lastRoastReset`: Updated when resetting usage counters

## Method 1: Using CLI Script (Recommended)

### Setup

1. Ensure you have the necessary environment variables:
   ```bash
   export DATABASE_URL="your-postgresql-connection-string"
   ```

2. Make the script executable:
   ```bash
   chmod +x scripts/update-user-plan.js
   ```

### Usage Examples

```bash
# Basic plan upgrade
node scripts/update-user-plan.js --email user@example.com --tier PRO

# Upgrade with Stripe details
node scripts/update-user-plan.js \
  --email user@example.com \
  --tier PRO \
  --subscription-id sub_1234567890 \
  --customer-id cus_1234567890

# Downgrade and reset usage
node scripts/update-user-plan.js \
  --email user@example.com \
  --tier FREE \
  --reset-usage

# Set enterprise with expiration
node scripts/update-user-plan.js \
  --email user@example.com \
  --tier ENTERPRISE \
  --expires 2024-12-31

# Use user ID instead of email
node scripts/update-user-plan.js \
  --userId cm1234567890 \
  --tier PRO

# Skip confirmation prompt
node scripts/update-user-plan.js \
  --email user@example.com \
  --tier PRO \
  --force
```

### CLI Options

| Option | Description | Required | Example |
|--------|-------------|----------|---------|
| `--email` | User's email address | Yes* | `--email user@example.com` |
| `--userId` | User's database ID | Yes* | `--userId cm1234567890` |
| `--tier` | New subscription tier | Yes | `--tier PRO` |
| `--subscription-id` | Stripe subscription ID | No | `--subscription-id sub_123` |
| `--customer-id` | Stripe customer ID | No | `--customer-id cus_123` |
| `--expires` | Subscription end date | No | `--expires 2024-12-31` |
| `--reset-usage` | Reset monthly roast count | No | `--reset-usage` |
| `--force` | Skip confirmation | No | `--force` |
| `--help` | Show help message | No | `--help` |

*Either `--email` or `--userId` is required.

## Method 2: Using Admin API

### Authentication

The API requires admin authentication. Add your email to the admin list in:
```typescript
// src/app/api/admin/update-user-plan/route.ts
function isAdmin(email: string): boolean {
  const adminEmails = [
    'admin@resumeroaster.com',
    'your-email@domain.com', // Add your email here
  ]
  return adminEmails.includes(email.toLowerCase())
}
```

### Update User Plan

**POST** `/api/admin/update-user-plan`

```bash
curl -X POST http://localhost:3000/api/admin/update-user-plan \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "email": "user@example.com",
    "subscriptionTier": "PRO",
    "subscriptionId": "sub_1234567890",
    "customerId": "cus_1234567890",
    "resetUsage": true
  }'
```

### Get User Information

**GET** `/api/admin/update-user-plan?email=user@example.com`

```bash
curl -X GET "http://localhost:3000/api/admin/update-user-plan?email=user@example.com" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

### API Request Body

```typescript
{
  // User identification (required - one of these)
  "email"?: string,
  "userId"?: string,
  
  // Plan details (required)
  "subscriptionTier": "FREE" | "PRO" | "ENTERPRISE",
  
  // Optional Stripe details
  "subscriptionId"?: string,
  "customerId"?: string,
  "subscriptionEndsAt"?: string, // ISO date string
  
  // Usage management
  "resetUsage"?: boolean
}
```

### API Response

```typescript
{
  "success": true,
  "message": "User user@example.com plan updated to PRO",
  "user": {
    "id": "cm1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "subscriptionTier": "PRO",
    "subscriptionId": "sub_1234567890",
    "customerId": "cus_1234567890",
    "subscriptionEndsAt": null,
    "monthlyRoasts": 0,
    "totalRoasts": 15,
    "lastRoastReset": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Plan Upgrade/Downgrade Logic

### Automatic Reset Scenarios

Usage counters are automatically reset in these cases:

1. **Downgrading to FREE**: Always resets monthly roasts to prevent abuse
2. **Explicit reset**: When `resetUsage` is true
3. **Monthly reset**: Happens automatically based on `lastRoastReset` date

### Plan Limits

| Tier | Monthly Roasts | Features |
|------|----------------|----------|
| FREE | 5 | Basic analysis |
| PRO | 40 | Premium analysis, history, downloads |
| ENTERPRISE | Unlimited | All features + API access |

## Direct Database Updates

If you prefer to update the database directly:

```sql
-- Update subscription tier only
UPDATE users 
SET subscription_tier = 'PRO', updated_at = NOW() 
WHERE email = 'user@example.com';

-- Update with Stripe details
UPDATE users 
SET 
  subscription_tier = 'PRO',
  subscription_id = 'sub_1234567890',
  customer_id = 'cus_1234567890',
  updated_at = NOW()
WHERE email = 'user@example.com';

-- Downgrade and reset usage
UPDATE users 
SET 
  subscription_tier = 'FREE',
  monthly_roasts = 0,
  last_roast_reset = NOW(),
  updated_at = NOW()
WHERE email = 'user@example.com';
```

## Troubleshooting

### Common Issues

1. **User not found**: Verify the email address or user ID
2. **Admin access denied**: Check if your email is in the admin list
3. **Database connection**: Ensure `DATABASE_URL` is set correctly
4. **Invalid tier**: Must be exactly `FREE`, `PRO`, or `ENTERPRISE`

### Verification

After updating a plan, verify the changes:

```bash
# Using the CLI script
node scripts/update-user-plan.js --email user@example.com --help

# Using the API
curl -X GET "http://localhost:3000/api/admin/update-user-plan?email=user@example.com"

# Check user limits
curl -X GET "http://localhost:3000/api/user/limits" \
  -H "Cookie: user-session-token"
```

## Security Notes

1. **Admin access**: Only add trusted emails to the admin list
2. **Environment variables**: Keep `DATABASE_URL` secure
3. **Session tokens**: Admin API requires valid authentication
4. **Audit trail**: All changes are logged with timestamps

## Examples by Scenario

### New Customer Upgrade
```bash
# Customer just paid for PRO plan
node scripts/update-user-plan.js \
  --email customer@example.com \
  --tier PRO \
  --subscription-id sub_1234567890 \
  --customer-id cus_1234567890
```

### Free Trial Expiration
```bash
# Trial expired, downgrade to FREE
node scripts/update-user-plan.js \
  --email trial-user@example.com \
  --tier FREE \
  --reset-usage
```

### Enterprise Demo
```bash
# Give enterprise access for 30 days
node scripts/update-user-plan.js \
  --email demo@company.com \
  --tier ENTERPRISE \
  --expires 2024-02-15
```

### Usage Reset for Support
```bash
# Reset usage counter for customer support
node scripts/update-user-plan.js \
  --email support-case@example.com \
  --tier PRO \
  --reset-usage
``` 