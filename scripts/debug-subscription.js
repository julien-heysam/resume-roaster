#!/usr/bin/env node

/**
 * Debug script to check subscription status and troubleshoot issues
 * 
 * Usage:
 * node scripts/debug-subscription.js --email user@example.com
 * node scripts/debug-subscription.js --userId cm123456
 * 
 * Options:
 * --email <email>     User email to check
 * --userId <id>       User ID to check
 * --fix-cache         Clear any potential cache issues
 * --help              Show this help message
 */

const { PrismaClient } = require('@prisma/client')

// Initialize Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function debugSubscription(options) {
  try {
    console.log('🔍 Starting subscription debug...\n')

    // Find user
    const whereClause = options.userId ? { id: options.userId } : { email: options.email }
    const user = await prisma.user.findUnique({ 
      where: whereClause,
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    })

    if (!user) {
      console.error(`❌ User not found`)
      process.exit(1)
    }

    console.log(`👤 User Information:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name || 'Not set'}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Created: ${user.createdAt}`)
    console.log(`   Last Updated: ${user.updatedAt}`)

    console.log(`\n💳 Subscription Details:`)
    console.log(`   Tier: ${user.subscriptionTier}`)
    console.log(`   Subscription ID: ${user.subscriptionId || 'None'}`)
    console.log(`   Customer ID: ${user.customerId || 'None'}`)
    console.log(`   Ends At: ${user.subscriptionEndsAt || 'No expiration'}`)

    console.log(`\n📊 Usage Information:`)
    console.log(`   Monthly Roasts: ${user.monthlyRoasts}`)
    console.log(`   Total Roasts: ${user.totalRoasts}`)
    console.log(`   Last Reset: ${user.lastRoastReset}`)

    // Check if monthly reset is needed
    const now = new Date()
    const lastReset = new Date(user.lastRoastReset)
    const monthsElapsed = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                         (now.getMonth() - lastReset.getMonth())

    if (monthsElapsed >= 1) {
      console.log(`   ⚠️  Monthly reset needed (${monthsElapsed} months elapsed)`)
    } else {
      console.log(`   ✅ Monthly reset up to date`)
    }

    console.log(`\n🔐 Recent Sessions:`)
    if (user.sessions.length === 0) {
      console.log(`   No active sessions found`)
    } else {
      user.sessions.forEach((session, index) => {
        console.log(`   ${index + 1}. Created: ${session.createdAt}, Expires: ${session.expires}`)
      })
    }

    // Check subscription tier limits
    console.log(`\n📋 Subscription Limits:`)
    switch (user.subscriptionTier) {
      case 'FREE':
        const freeRemaining = Math.max(0, 5 - user.monthlyRoasts)
        console.log(`   Plan: Free (5 roasts/month)`)
        console.log(`   Remaining: ${freeRemaining} roasts`)
        break
      case 'PLUS':
        const plusRemaining = Math.max(0, 100 - user.monthlyRoasts)
        console.log(`   Plan: Plus (100 roasts/month)`)
        console.log(`   Remaining: ${plusRemaining} roasts`)
        break
      case 'PREMIUM':
        console.log(`   Plan: Premium (unlimited roasts)`)
        console.log(`   Remaining: Unlimited`)
        break
    }

    // Database connection test
    console.log(`\n🔗 Database Connection Test:`)
    try {
      await prisma.$queryRaw`SELECT 1 as test`
      console.log(`   ✅ Database connection successful`)
    } catch (error) {
      console.log(`   ❌ Database connection failed: ${error.message}`)
    }

    // Environment check
    console.log(`\n🌍 Environment Information:`)
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'not set'}`)
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? 'configured' : 'not set'}`)

    // If fix-cache option is provided, perform a fresh update
    if (options.fixCache) {
      console.log(`\n🔄 Fixing potential cache issues...`)
      
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          updatedAt: new Date()
        }
      })
      
      console.log(`   ✅ User record touched at: ${updatedUser.updatedAt}`)
    }

    console.log(`\n✅ Debug completed successfully!`)

  } catch (error) {
    console.error(`❌ Error during debug:`, error.message)
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    switch (arg) {
      case '--email':
        options.email = args[++i]
        break
      case '--userId':
        options.userId = args[++i]
        break
      case '--fix-cache':
        options.fixCache = true
        break
      case '--help':
        showHelp()
        process.exit(0)
        break
      default:
        console.error(`Unknown option: ${arg}`)
        showHelp()
        process.exit(1)
    }
  }

  return options
}

function showHelp() {
  console.log(`
🔍 Subscription Debug Tool

Usage:
  node scripts/debug-subscription.js --email user@example.com
  node scripts/debug-subscription.js --userId cm123456

Options:
  --email <email>     User email to check
  --userId <id>       User ID to check
  --fix-cache         Touch user record to fix cache issues
  --help              Show this help message

Examples:
  # Debug user by email
  node scripts/debug-subscription.js --email user@example.com

  # Debug user by ID and fix cache
  node scripts/debug-subscription.js --userId cm123456 --fix-cache
`)
}

// Main execution
async function main() {
  const options = parseArgs()

  if (!options.email && !options.userId) {
    console.error('❌ Either --email or --userId is required')
    showHelp()
    process.exit(1)
  }

  await debugSubscription(options)
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { debugSubscription } 