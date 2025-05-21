import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/db"
import { getChatbotInsights } from "@/lib/telemetry"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if chatbot exists and belongs to the user
    const chatbotCheck = await sql`
      SELECT * FROM "Chatbot"
      WHERE id = ${params.id}
    `

    if (chatbotCheck.length === 0) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    const chatbot = chatbotCheck[0]

    if (chatbot.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get days parameter from query string
    const searchParams = req.nextUrl.searchParams
    const days = Number.parseInt(searchParams.get("days") || "30", 10)

    // Get insights
    const insights = await getChatbotInsights(params.id, days)

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Error fetching chatbot insights:", error)
    return NextResponse.json({ error: "Failed to fetch chatbot insights" }, { status: 500 })
  }
}
