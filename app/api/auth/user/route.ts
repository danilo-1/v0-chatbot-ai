import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getToken } from "next-auth/jwt"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request) {
  try {
    // Get session using both methods
    const session = await getServerSession(authOptions)
    const token = await getToken({ req })

    // Try to get user ID from multiple sources
    const userId = session?.user?.id || token?.sub || token?.id

    if (!userId) {
      return NextResponse.json({ error: "No user ID found in session" }, { status: 401 })
    }

    // Check if user exists in database
    const userCheck = await sql`
      SELECT * FROM "User" WHERE id = ${userId}
    `

    if (userCheck.length === 0) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    // Return user information
    return NextResponse.json({
      id: userCheck[0].id,
      name: userCheck[0].name,
      email: userCheck[0].email,
      role: userCheck[0].role,
      sessionInfo: {
        hasSession: !!session,
        sessionUserId: session?.user?.id,
        tokenUserId: token?.sub || token?.id,
      },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user information",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
