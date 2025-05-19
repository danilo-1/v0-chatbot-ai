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
    // Get all models
    const models = await sql`
      SELECT * FROM "AIModel"
      ORDER BY "isdefault" DESC, name ASC
    `

    return NextResponse.json(models)
  } catch (error) {
    console.error("Error fetching AI models:", error)
    return NextResponse.json({ error: "Failed to fetch AI models" }, { status: 500 })
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
    if (!data.name || !data.modelid || !data.provider) {
      return NextResponse.json({ error: "Name, Model ID, and Provider are required" }, { status: 400 })
    }

    // If this is set as default, unset any existing default
    if (data.isdefault) {
      await sql`
        UPDATE "AIModel"
        SET "isdefault" = false
        WHERE "isdefault" = true
      `
    }

    // Generate a UUID for the model
    const uuidResult = await sql`SELECT gen_random_uuid() as uuid`
    const modelId = uuidResult[0].uuid

    // Create new model
    const result = await sql`
      INSERT INTO "AIModel" (
        id,
        name,
        "modelid",
        provider,
        "isdefault",
        "isactive",
        "maxtokens",
        "createdat",
        "updatedat"
      ) VALUES (
        ${modelId},
        ${data.name},
        ${data.modelid},
        ${data.provider},
        ${data.isdefault || false},
        ${data.isactive || true},
        ${data.maxtokens || 4000},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating AI model:", error)
    return NextResponse.json({ error: "Failed to create AI model" }, { status: 500 })
  }
}
