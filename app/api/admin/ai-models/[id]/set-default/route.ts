import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Unset any existing default
    await sql`
      UPDATE "AIModel"
      SET "isdefault" = false
      WHERE "isdefault" = true
    `

    // Set this model as default
    const result = await sql`
      UPDATE "AIModel"
      SET "isdefault" = true, "updatedat" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error setting default AI model ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to set default AI model" }, { status: 500 })
  }
}
