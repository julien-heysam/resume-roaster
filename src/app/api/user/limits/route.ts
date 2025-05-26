import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { UserService } from "@/lib/database"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const limits = await UserService.checkRoastLimit(session.user.id)

    return NextResponse.json({
      canRoast: limits.canRoast,
      remaining: limits.remaining,
      used: limits.used,
      limit: limits.limit,
      tier: limits.tier
    })

  } catch (error) {
    console.error("Error fetching user limits:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 