import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  console.log("GET /api/admin/chatbot-settings - Starting")

  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    console.log("Unauthorized - Not admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const chatbotId = searchParams.get("id")

    if (chatbotId) {
      // Get specific chatbot
      const result = await sql`
        SELECT c.*, u.name as "userName", u.email as "userEmail"
        FROM "Chatbot" c
        JOIN "User" u ON c."userId" = u.id
        WHERE c.id = ${chatbotId}
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
      }

      return NextResponse.json(result[0])
    } else {
      // Search chatbots
      const result = await sql`
        SELECT c.id, c.name, c.description, c."isPublic", c.temperature, c."maxTokens", 
               u.name as "userName", u.email as "userEmail"
        FROM "Chatbot" c
        JOIN "User" u ON c."userId" = u.id
        WHERE 
          c.name ILIKE ${"%" + search + "%"} OR
          c.description ILIKE ${"%" + search + "%"} OR
          u.name ILIKE ${"%" + search + "%"} OR
          u.email ILIKE ${"%" + search + "%"}
        ORDER BY c."createdAt" DESC
        LIMIT 20
      `

      return NextResponse.json(result)
    }
  } catch (error) {
    console.error("Error fetching chatbot settings:", error)
    return NextResponse.json({ error: "Failed to fetch chatbot settings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  console.log("PUT /api/admin/chatbot-settings - Starting")

  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    console.log("Unauthorized - Not admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()

    if (!data.id) {
      return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 })
    }

    // Update chatbot AI settings
    const result = await sql`
      UPDATE "Chatbot"
      SET
        temperature = ${data.temperature || 0.7},
        "maxTokens" = ${data.maxTokens || 1000},
        "customPrompt" = ${data.customPrompt || null},
        "updatedAt" = NOW()
      WHERE id = ${data.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating chatbot settings:", error)
    return NextResponse.json({ error: "Failed to update chatbot settings" }, { status: 500 })
  }
}
