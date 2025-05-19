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
      SELECT * FROM "AIModel"
      WHERE id = ${params.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error fetching AI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch AI model" }, { status: 500 })
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
    if (!data.name || !data.modelid || !data.provider) {
      return NextResponse.json({ error: "Name, Model ID, and Provider are required" }, { status: 400 })
    }

    // Check if model exists
    const modelCheck = await sql`
      SELECT * FROM "AIModel"
      WHERE id = ${params.id}
    `

    if (modelCheck.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // If this is set as default, unset any existing default
    if (data.isdefault) {
      await sql`
        UPDATE "AIModel"
        SET "isdefault" = false
        WHERE "isdefault" = true
      `
    }

    // Update model
    const result = await sql`
      UPDATE "AIModel"
      SET
        name = ${data.name},
        "modelid" = ${data.modelid},
        provider = ${data.provider},
        "isdefault" = ${data.isdefault || false},
        "isactive" = ${data.isactive || true},
        "maxtokens" = ${data.maxtokens || 4000},
        "updatedat" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error updating AI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update AI model" }, { status: 500 })
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
      SELECT * FROM "AIModel"
      WHERE id = ${params.id}
    `

    if (modelCheck.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // Update only the provided fields
    const result = await sql`
      UPDATE "AIModel"
      SET "isactive" = ${data.isactive}, "updatedat" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error patching AI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update AI model" }, { status: 500 })
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
      SELECT * FROM "AIModel"
      WHERE id = ${params.id}
    `

    if (modelCheck.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // Check if this is the default model
    if (modelCheck[0].isdefault) {
      return NextResponse.json(
        { error: "Cannot delete the default model. Set another model as default first." },
        { status: 400 },
      )
    }

    // Delete model
    await sql`
      DELETE FROM "AIModel"
      WHERE id = ${params.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting AI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete AI model" }, { status: 500 })
  }
}
