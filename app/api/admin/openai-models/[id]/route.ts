import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await sql`
      SELECT * FROM "OpenAIModel"
      WHERE id = ${params.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error fetching OpenAI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch OpenAI model" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if model exists
    const modelCheck = await sql`
      SELECT * FROM "OpenAIModel"
      WHERE id = ${params.id}
    `

    if (modelCheck.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // If this is set as default, unset any existing default
    if (data.isDefault) {
      await sql`
        UPDATE "OpenAIModel"
        SET "isDefault" = false
        WHERE "isDefault" = true
      `
    }

    // Update model
    const result = await sql`
      UPDATE "OpenAIModel"
      SET
        name = ${data.name},
        "modelId" = ${data.modelId},
        "isDefault" = ${data.isDefault || false},
        "isActive" = ${data.isActive || true},
        "maxTokens" = ${data.maxTokens || 4000},
        "updatedAt" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error updating OpenAI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update OpenAI model" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()

    // Check if model exists
    const modelCheck = await sql`
      SELECT * FROM "OpenAIModel"
      WHERE id = ${params.id}
    `

    if (modelCheck.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // Update only the provided fields
    const updates = []
    const values = {}

    if (data.name !== undefined) {
      updates.push(`name = ${data.name}`)
      values.name = data.name
    }

    if (data.modelId !== undefined) {
      updates.push(`"modelId" = ${data.modelId}`)
      values.modelId = data.modelId
    }

    if (data.isActive !== undefined) {
      updates.push(`"isActive" = ${data.isActive}`)
      values.isActive = data.isActive
    }

    if (data.maxTokens !== undefined) {
      updates.push(`"maxTokens" = ${data.maxTokens}`)
      values.maxTokens = data.maxTokens
    }

    // Always update the updatedAt timestamp
    updates.push(`"updatedAt" = NOW()`)

    // Construct and execute the SQL query
    const result = await sql`
      UPDATE "OpenAIModel"
      SET "isActive" = ${data.isActive}, "updatedAt" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error patching OpenAI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update OpenAI model" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if model exists
    const modelCheck = await sql`
      SELECT * FROM "OpenAIModel"
      WHERE id = ${params.id}
    `

    if (modelCheck.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // Check if this is the default model
    if (modelCheck[0].isDefault) {
      return NextResponse.json(
        { error: "Cannot delete the default model. Set another model as default first." },
        { status: 400 },
      )
    }

    // Delete model
    await sql`
      DELETE FROM "OpenAIModel"
      WHERE id = ${params.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting OpenAI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete OpenAI model" }, { status: 500 })
  }
}
