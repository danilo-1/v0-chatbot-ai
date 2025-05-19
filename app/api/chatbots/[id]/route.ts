import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`GET /api/chatbots/${params.id} - Starting`)

  try {
    // Fetch chatbot directly with SQL
    const result = await sql`
      SELECT * FROM "Chatbot"
      WHERE id = ${params.id}
    `

    if (result.length === 0) {
      console.log(`Chatbot with ID ${params.id} not found`)
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    console.log(`Found chatbot: ${result[0].name}`)
    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error fetching chatbot ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch chatbot" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`PUT /api/chatbots/${params.id} - Starting`)

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    console.log("Unauthorized - No valid session")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if chatbot exists and belongs to the user
    const chatbotCheck = await sql`
      SELECT * FROM "Chatbot"
      WHERE id = ${params.id}
    `

    if (chatbotCheck.length === 0) {
      console.log(`Chatbot with ID ${params.id} not found`)
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    const chatbot = chatbotCheck[0]

    if (chatbot.userId !== session.user.id && session.user.role !== "admin") {
      console.log(`User ${session.user.id} does not own chatbot ${params.id}`)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse request data
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

    // Update chatbot
    const result = await sql`
      UPDATE "Chatbot"
      SET
        name = ${data.name},
        description = ${data.description || null},
        "isPublic" = ${data.isPublic || false},
        temperature = ${data.temperature || 0.7},
        "maxTokens" = ${data.maxTokens || 1000},
        "knowledgeBase" = ${data.knowledgeBase || null},
        "customPrompt" = ${data.customPrompt || null},
        "updatedAt" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      console.error("No result returned from update")
      throw new Error("Failed to update chatbot")
    }

    console.log("Chatbot updated successfully:", result[0].name)
    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error updating chatbot ${params.id}:`, error)
    return NextResponse.json(
      {
        error: "Failed to update chatbot",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`DELETE /api/chatbots/${params.id} - Starting`)

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    console.log("Unauthorized - No valid session")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if chatbot exists and belongs to the user
    const chatbotCheck = await sql`
      SELECT * FROM "Chatbot"
      WHERE id = ${params.id}
    `

    if (chatbotCheck.length === 0) {
      console.log(`Chatbot with ID ${params.id} not found`)
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    const chatbot = chatbotCheck[0]

    if (chatbot.userId !== session.user.id && session.user.role !== "admin") {
      console.log(`User ${session.user.id} does not own chatbot ${params.id}`)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete chatbot
    await sql`
      DELETE FROM "Chatbot"
      WHERE id = ${params.id}
    `

    console.log(`Chatbot ${params.id} deleted successfully`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting chatbot ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete chatbot" }, { status: 500 })
  }
}
