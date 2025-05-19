import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
  try {
    console.log("GET /api/chatbots - Starting")

    const session = await getServerSession(authOptions)
    const token = await getToken({ req })

    // Try to get user ID from multiple sources
    const userId = session?.user?.id || token?.sub || token?.id

    console.log("User ID from session/token:", userId)

    const searchParams = req.nextUrl.searchParams
    const requestedUserId = searchParams.get("userId")

    console.log("Requested user ID from query:", requestedUserId)

    // If a specific user's chatbots are requested and it matches the authenticated user
    if (requestedUserId && userId === requestedUserId) {
      console.log("Fetching chatbots for specific user:", userId)

      // Get user's chatbots with direct SQL
      const result = await sql`
        SELECT c.*, u.name as "userName"
        FROM "Chatbot" c
        JOIN "User" u ON c."userId" = u.id
        WHERE c."userId" = ${userId}
        ORDER BY c."createdAt" DESC
      `

      // Convert the result to a plain JavaScript array of objects
      const chatbots = result.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.imageUrl,
        isPublic: row.isPublic,
        userId: row.userId,
        userName: row.userName,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        temperature: row.temperature,
        maxTokens: row.maxTokens,
        knowledgeBase: row.knowledgeBase,
        customPrompt: row.customPrompt,
        modelId: row.modelId,
      }))

      console.log(`Found ${chatbots.length} chatbots for user ${userId}`)
      return NextResponse.json(chatbots)
    } else {
      console.log("Fetching public chatbots")

      // Get public chatbots
      const result = await sql`
        SELECT c.*, u.name as "userName"
        FROM "Chatbot" c
        JOIN "User" u ON c."userId" = u.id
        WHERE c."isPublic" = true
        ORDER BY c."createdAt" DESC
      `

      // Convert the result to a plain JavaScript array of objects
      const chatbots = result.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.imageUrl,
        isPublic: row.isPublic,
        userId: row.userId,
        userName: row.userName,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }))

      console.log(`Found ${chatbots.length} public chatbots`)
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

    // Get session using both methods to ensure we have user ID
    const session = await getServerSession(authOptions)
    const token = await getToken({ req })

    console.log("Session from getServerSession:", session)
    console.log("Token from getToken:", token)

    // Try to get user ID from multiple sources
    const userId = session?.user?.id || token?.sub || token?.id

    console.log("Resolved userId:", userId)

    if (!userId) {
      console.log("Unauthorized - No valid user ID found")
      return NextResponse.json({ error: "Unauthorized - No valid user ID found" }, { status: 401 })
    }

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

    console.log("Attempting to create chatbot in database with userId:", userId)

    try {
      // Check if User exists
      const userCheck = await sql`
        SELECT EXISTS (
          SELECT 1 FROM "User" WHERE id = ${userId}
        )
      `

      console.log("User check result:", userCheck)

      if (!userCheck[0].exists) {
        console.error("User does not exist in database")
        return NextResponse.json({ error: "User not found in database" }, { status: 404 })
      }

      // Generate a UUID for the chatbot
      const uuidResult = await sql`SELECT gen_random_uuid() as uuid`
      const chatbotId = uuidResult[0].uuid

      console.log("Generated chatbot ID:", chatbotId)

      // Create chatbot using SQL with explicit values
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
          "modelId",
          "createdAt",
          "updatedAt"
        ) VALUES (
          ${chatbotId},
          ${data.name},
          ${data.description || ""},
          ${data.isPublic || false},
          ${userId},
          ${data.temperature || 0.7},
          ${data.maxTokens || 1000},
          ${data.knowledgeBase || ""},
          ${data.customPrompt || ""},
          ${data.modelId || null},
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

      // Double-check that the chatbot was created
      const verifyResult = await sql`
        SELECT * FROM "Chatbot" WHERE id = ${chatbotId}
      `

      console.log("Verification query result:", verifyResult)

      // Convert to a plain JavaScript object
      const chatbot = {
        id: verifyResult[0].id,
        name: verifyResult[0].name,
        description: verifyResult[0].description,
        isPublic: verifyResult[0].isPublic,
        userId: verifyResult[0].userId,
        temperature: verifyResult[0].temperature,
        maxTokens: verifyResult[0].maxTokens,
        knowledgeBase: verifyResult[0].knowledgeBase,
        customPrompt: verifyResult[0].customPrompt,
        modelId: verifyResult[0].modelId,
        createdAt: verifyResult[0].createdAt,
        updatedAt: verifyResult[0].updatedAt,
      }

      return NextResponse.json(chatbot)
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
