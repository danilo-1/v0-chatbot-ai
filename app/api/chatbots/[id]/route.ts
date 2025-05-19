import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`GET /api/chatbots/${id} - Starting`)

    // Get chatbot with direct SQL
    const result = await sql`
      SELECT c.*, u.name as "userName"
      FROM "Chatbot" c
      JOIN "User" u ON c."userId" = u.id
      WHERE c.id = ${id}
    `

    if (result.length === 0) {
      console.log(`Chatbot with ID ${id} not found`)
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    // Convert to a plain JavaScript object
    const chatbot = {
      id: result[0].id,
      name: result[0].name,
      description: result[0].description,
      imageUrl: result[0].imageUrl,
      isPublic: result[0].isPublic,
      userId: result[0].userId,
      userName: result[0].userName,
      temperature: result[0].temperature,
      maxTokens: result[0].maxTokens,
      knowledgeBase: result[0].knowledgeBase,
      customPrompt: result[0].customPrompt,
      modelId: result[0].modelId,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt,
    }

    // Check if user is authorized to view this chatbot
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!chatbot.isPublic && chatbot.userId !== userId) {
      console.log(`Unauthorized access to chatbot ${id} by user ${userId}`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Successfully retrieved chatbot ${id}`)
    return NextResponse.json(chatbot)
  } catch (error) {
    console.error(`Error fetching chatbot ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch chatbot" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`PUT /api/chatbots/${id} - Starting`)

    // Check if user is authorized
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      console.log("Unauthorized - No valid user ID found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if chatbot exists and belongs to user
    const chatbotCheck = await sql`
      SELECT "userId" FROM "Chatbot" WHERE id = ${id}
    `

    if (chatbotCheck.length === 0) {
      console.log(`Chatbot with ID ${id} not found`)
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    if (chatbotCheck[0].userId !== userId) {
      console.log(`Unauthorized access to chatbot ${id} by user ${userId}`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const data = await req.json()
    console.log("Request data:", data)

    // Update chatbot
    const result = await sql`
      UPDATE "Chatbot"
      SET
        name = COALESCE(${data.name}, name),
        description = COALESCE(${data.description}, description),
        "imageUrl" = COALESCE(${data.imageUrl}, "imageUrl"),
        "isPublic" = COALESCE(${data.isPublic}, "isPublic"),
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      console.error("No result returned from update")
      throw new Error("No result returned from database")
    }

    // Convert to a plain JavaScript object
    const chatbot = {
      id: result[0].id,
      name: result[0].name,
      description: result[0].description,
      imageUrl: result[0].imageUrl,
      isPublic: result[0].isPublic,
      userId: result[0].userId,
      temperature: result[0].temperature,
      maxTokens: result[0].maxTokens,
      knowledgeBase: result[0].knowledgeBase,
      customPrompt: result[0].customPrompt,
      modelId: result[0].modelId,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt,
    }

    console.log(`Successfully updated chatbot ${id}`)
    return NextResponse.json(chatbot)
  } catch (error) {
    console.error(`Error updating chatbot ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update chatbot" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`DELETE /api/chatbots/${id} - Starting`)

    // Check if user is authorized
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      console.log("Unauthorized - No valid user ID found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if chatbot exists and belongs to user
    const chatbotCheck = await sql`
      SELECT "userId" FROM "Chatbot" WHERE id = ${id}
    `

    if (chatbotCheck.length === 0) {
      console.log(`Chatbot with ID ${id} not found`)
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    if (chatbotCheck[0].userId !== userId) {
      console.log(`Unauthorized access to chatbot ${id} by user ${userId}`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete chatbot
    await sql`
      DELETE FROM "Chatbot" WHERE id = ${id}
    `

    console.log(`Successfully deleted chatbot ${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting chatbot ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete chatbot" }, { status: 500 })
  }
}
