import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `

    return NextResponse.json({ tables: tables.map((t: any) => t.table_name) })
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch tables",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()

    if (!data.query || typeof data.query !== "string") {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    const result = await sql(data.query)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error executing query:", error)
    return NextResponse.json(
      {
        error: "Failed to execute query",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
