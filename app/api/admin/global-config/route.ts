import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Use direct SQL query instead of Prisma
    const result = await sql`SELECT * FROM "GlobalConfig" WHERE id = 'global'`

    // If no config exists, create one
    if (result.length === 0) {
      const newConfig = await sql`
        INSERT INTO "GlobalConfig" (
          id, 
          "globalPrompt", 
          "allowedTopics", 
          "blockedTopics", 
          "maxTokens", 
          temperature
        ) VALUES (
          'global',
          'You are a helpful assistant for websites. Answer questions based on the provided context.',
          'customer service, product information, general help',
          'illegal activities, harmful content, personal information',
          2000,
          0.7
        )
        RETURNING *
      `
      return NextResponse.json(newConfig[0])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching global config:", error)
    return NextResponse.json({ error: "Failed to fetch global config" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()

    // Use direct SQL query instead of Prisma
    const result = await sql`
      UPDATE "GlobalConfig"
      SET 
        "globalPrompt" = ${data.globalPrompt || null},
        "allowedTopics" = ${data.allowedTopics || null},
        "blockedTopics" = ${data.blockedTopics || null},
        "maxTokens" = ${data.maxTokens || null},
        "temperature" = ${data.temperature || null}
      WHERE id = 'global'
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating global config:", error)
    return NextResponse.json({ error: "Failed to update global config" }, { status: 500 })
  }
}
