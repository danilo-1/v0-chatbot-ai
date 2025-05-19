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
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    console.log("Creating chatbot with data:", data)
    console.log("User ID:", session.user.id)

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
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

    if (result.length === 0) {
      throw new Error("Failed to create chatbot")
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating chatbot:", error)
    return NextResponse.json({ error: "Failed to create chatbot" }, { status: 500 })
  }
}
