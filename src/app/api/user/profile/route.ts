import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/database"

// GET - Retrieve user profile data
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // For now, we'll store profile data in the user's name field as JSON
    // In a production app, you'd want a separate UserProfile table
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        // We'll use a custom field or extend the schema later
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // For now, return basic user info
    // In the future, this would come from a dedicated profile table
    const profile = {
      personalInfo: {
        name: user.name || '',
        email: user.email || '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        github: ''
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Save user profile data
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { profile } = await req.json()

    if (!profile) {
      return NextResponse.json(
        { error: "Profile data is required" },
        { status: 400 }
      )
    }

    // For now, we'll store basic info in the user table
    // In production, you'd want a separate UserProfile table
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: profile.personalInfo?.name || session.user.name,
        // Note: We're not storing the full profile yet
        // This would require extending the database schema
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      profile: {
        personalInfo: {
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: '',
          location: '',
          linkedin: '',
          portfolio: '',
          github: ''
        },
        lastUpdated: updatedUser.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error("Error saving user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 