import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (userId && session?.user?.id === userId) {
      // Get user's chatbots
      const chatbots = await sql`
        SELECT c.*, u.name as "userName"
        FROM "Chatbot" c
        JOIN "User" u ON c."userId" = u.id
        WHERE c."userId" = ${userId}
        ORDER BY c."createdAt" DESC
      `
      return NextResponse.json(chatbots)
    } else {
      // Get public chatbots
      const chatbots = await sql`
        SELECT c.*, u.name as "userName"
        FROM "Chatbot" c
        JOIN "User" u ON c."userId" = u.id
        WHERE c."isPublic" = true
        ORDER BY c."createdAt" DESC
      `
      return NextResponse.json(chatbots)
    }
  } catch (error) {
    console.error("Error fetching chatbots:", error)
    return NextResponse.json({ error: "Failed to fetch chatbots" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/chatbots - Starting")

    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "exists" : "null")

    if (!session?.user) {
      console.log("Unauthorized - No session or user")
      return NextResponse.json({ error: "Unauthorized - No valid session" }, { status: 401 })
    }

    console.log("User ID from session:", session.user.id)

    let data
    try {
      data = await req.json()
      console.log("Request data:", data)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Validate required fields
    if (!data.name) {
      console.log("Validation error: Name is required")
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    console.log("Attempting to create chatbot in database")

    try {
      // Check if Chatbot table exists
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'Chatbot'
        )
      `

      console.log("Table check result:", tableCheck)

      if (!tableCheck[0].exists) {
        console.error("Chatbot table does not exist")
        return NextResponse.json({ error: "Database schema not initialized" }, { status: 500 })
      }

      // Create chatbot using SQL
      const result = await sql`
        INSERT INTO "Chatbot" (
          id,
          name,
          description,
          "isPublic",
          "userId",
          "temperature",
          "maxTokens",
          "knowledgeBase",
          "customPrompt",
          "createdAt",
          "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          ${data.name},
          ${data.description || ""},
          ${data.isPublic || false},
          ${session.user.id},
          ${data.temperature || 0.7},
          ${data.maxTokens || 1000},
          ${data.knowledgeBase || ""},
          ${data.customPrompt || ""},
          NOW(),
          NOW()
        )
        RETURNING *
      `

      console.log("Database insert result:", result)

      if (result.length === 0) {
        console.error("No result returned from insert")
        throw new Error("No result returned from database")
      }

      return NextResponse.json(result[0])
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          error: "Database error",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unhandled error in POST /api/chatbots:", error)
    return NextResponse.json(
      {
        error: "Failed to create chatbot",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
