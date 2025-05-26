import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { UserService } from "@/lib/database"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user can roast before incrementing
    const limits = await UserService.checkRoastLimit(session.user.id)
    
    if (!limits.canRoast) {
      return NextResponse.json(
        { 
          error: "Roast limit exceeded",
          limits
        },
        { status: 429 }
      )
    }

    // Increment the roast count
    await UserService.incrementRoastCount(session.user.id)

    // Return updated limits
    const updatedLimits = await UserService.checkRoastLimit(session.user.id)

    return NextResponse.json({
      success: true,
      limits: {
        canRoast: updatedLimits.canRoast,
        remaining: updatedLimits.remaining,
        used: updatedLimits.used,
        limit: updatedLimits.limit,
        tier: updatedLimits.tier
      }
    })

  } catch (error) {
    console.error("Error incrementing roast count:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 