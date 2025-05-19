import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if OpenAIModel table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'OpenAIModel'
      )
    `

    if (!tableExists[0].exists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE "OpenAIModel" (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          "modelId" TEXT NOT NULL,
          "isDefault" BOOLEAN DEFAULT false,
          "isActive" BOOLEAN DEFAULT true,
          "maxTokens" INTEGER DEFAULT 4000,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `

      // Add default models
      await sql`
        INSERT INTO "OpenAIModel" (id, name, "modelId", "isDefault", "isActive", "maxTokens")
        VALUES 
          (gen_random_uuid(), 'GPT-4o', 'gpt-4o', true, true, 4000),
          (gen_random_uuid(), 'GPT-3.5 Turbo', 'gpt-3.5-turbo', false, true, 4000)
      `
    }

    // Get all models
    const models = await sql`
      SELECT * FROM "OpenAIModel"
      ORDER BY "isDefault" DESC, name ASC
    `

    return NextResponse.json(models)
  } catch (error) {
    console.error("Error fetching OpenAI models:", error)
    return NextResponse.json({ error: "Failed to fetch OpenAI models" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()

    // Validate required fields
    if (!data.name || !data.modelId) {
      return NextResponse.json({ error: "Name and Model ID are required" }, { status: 400 })
    }

    // If this is set as default, unset any existing default
    if (data.isDefault) {
      await sql`
        UPDATE "OpenAIModel"
        SET "isDefault" = false
        WHERE "isDefault" = true
      `
    }

    // Generate a UUID for the model
    const uuidResult = await sql`SELECT gen_random_uuid() as uuid`
    const modelId = uuidResult[0].uuid

    // Create new model
    const result = await sql`
      INSERT INTO "OpenAIModel" (
        id,
        name,
        "modelId",
        "isDefault",
        "isActive",
        "maxTokens",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${modelId},
        ${data.name},
        ${data.modelId},
        ${data.isDefault || false},
        ${data.isActive || true},
        ${data.maxTokens || 4000},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating OpenAI model:", error)
    return NextResponse.json({ error: "Failed to create OpenAI model" }, { status: 500 })
  }
}
