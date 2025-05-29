#!/usr/bin/env node

/**
 * Script to manually update user subscription plans
 * 
 * Usage:
 * node scripts/update-user-plan.js --email user@example.com --tier PLUS
 * node scripts/update-user-plan.js --userId cm123456 --tier PREMIUM --reset-usage
 * 
 * Options:
 * --email <email>              User email
 * --userId <id>               User ID
 * --tier <FREE|PLUS|PREMIUM> New subscription tier
 * --subscription-id <id>       Stripe subscription ID (optional)
 * --customer-id <id>          Stripe customer ID (optional)
 * --expires <date>            Subscription end date (YYYY-MM-DD) (optional)
 * --reset-usage               Reset monthly roast count
 * --help                      Show this help message
 */

const { PrismaClient } = require('@prisma/client')
const path = require('path')

// Initialize Prisma with the correct schema location
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function updateUserPlan(options) {
  try {
    // Find user
    const whereClause = options.userId ? { id: options.userId } : { email: options.email }
    const user = await prisma.user.findUnique({ where: whereClause })

    if (!user) {
      console.error(`❌ User not found`)
      process.exit(1)
    }

    console.log(`📧 Found user: ${user.email} (${user.name || 'No name'})`)
    console.log(`📊 Current plan: ${user.subscriptionTier}`)
    console.log(`🔥 Current monthly roasts: ${user.monthlyRoasts}`)

    // Prepare update data
    const updateData = {
      subscriptionTier: options.tier,
      updatedAt: new Date()
    }

    // Optional fields
    if (options.subscriptionId) {
      updateData.subscriptionId = options.subscriptionId
    }
    if (options.customerId) {
      updateData.customerId = options.customerId
    }
    if (options.expires) {
      updateData.subscriptionEndsAt = new Date(options.expires)
    }

    // Reset usage if requested or downgrading to FREE
    if (options.resetUsage || (options.tier === 'FREE' && user.subscriptionTier !== 'FREE')) {
      updateData.monthlyRoasts = 0
      updateData.lastRoastReset = new Date()
      console.log(`🔄 Resetting usage counters`)
    }

    // Show what will be updated
    console.log(`\n🔄 Updating plan:`)
    console.log(`   Plan: ${user.subscriptionTier} → ${options.tier}`)
    if (updateData.subscriptionId) console.log(`   Subscription ID: ${updateData.subscriptionId}`)
    if (updateData.customerId) console.log(`   Customer ID: ${updateData.customerId}`)
    if (updateData.subscriptionEndsAt) console.log(`   Expires: ${updateData.subscriptionEndsAt}`)
    if (updateData.monthlyRoasts !== undefined) console.log(`   Monthly roasts: ${user.monthlyRoasts} → 0`)

    // Confirm before updating
    if (!options.force) {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })

      const confirm = await new Promise(resolve => {
        readline.question('\n❓ Do you want to proceed? (y/N): ', answer => {
          readline.close()
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
        })
      })

      if (!confirm) {
        console.log('❌ Cancelled')
        process.exit(0)
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        subscriptionId: true,
        customerId: true,
        subscriptionEndsAt: true,
        monthlyRoasts: true,
        totalRoasts: true,
        lastRoastReset: true,
        updatedAt: true
      }
    })

    console.log(`\n✅ User plan updated successfully!`)
    console.log(`📧 Email: ${updatedUser.email}`)
    console.log(`📊 New plan: ${updatedUser.subscriptionTier}`)
    console.log(`🔥 Monthly roasts: ${updatedUser.monthlyRoasts}`)
    if (updatedUser.subscriptionId) console.log(`🔗 Subscription ID: ${updatedUser.subscriptionId}`)
    if (updatedUser.customerId) console.log(`👤 Customer ID: ${updatedUser.customerId}`)
    if (updatedUser.subscriptionEndsAt) console.log(`⏰ Expires: ${updatedUser.subscriptionEndsAt}`)

  } catch (error) {
    console.error(`❌ Error updating user plan:`, error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

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
      case '--user-id':
        options.userId = args[++i]
        break
      case '--tier':
        options.tier = args[++i]
        break
      case '--subscription-id':
        options.subscriptionId = args[++i]
        break
      case '--customer-id':
        options.customerId = args[++i]
        break
      case '--expires':
        options.expires = args[++i]
        break
      case '--reset-usage':
        options.resetUsage = true
        break
      case '--force':
        options.force = true
        break
      case '--help':
        showHelp()
        process.exit(0)
        break
      default:
        console.error(`❌ Unknown argument: ${arg}`)
        showHelp()
        process.exit(1)
    }
  }

  return options
}

function showHelp() {
  console.log(`
📝 Update User Subscription Plan

Usage:
  node scripts/update-user-plan.js --email user@example.com --tier PLUS
  node scripts/update-user-plan.js --userId cm123456 --tier PREMIUM --reset-usage

Options:
  --email <email>              User email
  --userId <id>               User ID  
  --tier <FREE|PLUS|PREMIUM> New subscription tier (required)
  --subscription-id <id>       Stripe subscription ID (optional)
  --customer-id <id>          Stripe customer ID (optional)
  --expires <date>            Subscription end date YYYY-MM-DD (optional)
  --reset-usage               Reset monthly roast count to 0
  --force                     Skip confirmation prompt
  --help                      Show this help message

Examples:
  # Upgrade user to PLUS
  node scripts/update-user-plan.js --email user@example.com --tier PLUS

  # Downgrade user to FREE and reset usage
  node scripts/update-user-plan.js --userId cm123456 --tier FREE --reset-usage

  # Set PREMIUM with expiration
  node scripts/update-user-plan.js --email user@example.com --tier PREMIUM --expires 2024-12-31

  # Update with Stripe IDs
  node scripts/update-user-plan.js --email user@example.com --tier PLUS \\
    --subscription-id sub_123 --customer-id cus_456
`)
}

function validateOptions(options) {
  if (!options.email && !options.userId) {
    console.error('❌ Either --email or --userId is required')
    showHelp()
    process.exit(1)
  }

  if (!options.tier) {
    console.error('❌ --tier is required')
    showHelp()
    process.exit(1)
  }

  if (!['FREE', 'PLUS', 'PREMIUM'].includes(options.tier.toUpperCase())) {
    console.error('❌ Invalid tier. Must be FREE, PLUS, or PREMIUM')
    process.exit(1)
  }

  options.tier = options.tier.toUpperCase()

  if (options.expires && !/^\d{4}-\d{2}-\d{2}$/.test(options.expires)) {
    console.error('❌ Invalid date format. Use YYYY-MM-DD')
    process.exit(1)
  }

  return options
}

// Main execution
async function main() {
  console.log('🔥 Resume Roaster - Update User Plan\n')

  const options = parseArgs()
  const validatedOptions = validateOptions(options)
  
  await updateUserPlan(validatedOptions)
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })
} 