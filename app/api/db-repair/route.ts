import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow admin users
    if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Starting database repair")

    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const tableNames = tables.map((t) => t.table_name)
    console.log("Existing tables:", tableNames)

    // Check Chatbot table structure
    let chatbotColumns = []
    if (tableNames.includes("Chatbot")) {
      chatbotColumns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'Chatbot'
      `
      console.log("Chatbot table columns:", chatbotColumns)
    }

    // Check for orphaned chatbots (no valid user)
    let orphanedChatbots = []
    if (tableNames.includes("Chatbot") && tableNames.includes("User")) {
      orphanedChatbots = await sql`
        SELECT c.id, c.name, c."userId"
        FROM "Chatbot" c
        LEFT JOIN "User" u ON c."userId" = u.id
        WHERE u.id IS NULL
      `
      console.log("Orphaned chatbots:", orphanedChatbots)
    }

    // Check for users with no chatbots
    let usersWithNoChatbots = []
    if (tableNames.includes("Chatbot") && tableNames.includes("User")) {
      usersWithNoChatbots = await sql`
        SELECT u.id, u.name, u.email
        FROM "User" u
        LEFT JOIN "Chatbot" c ON u.id = c."userId"
        WHERE c.id IS NULL
      `
      console.log("Users with no chatbots:", usersWithNoChatbots)
    }

    // Count chatbots per user
    let chatbotsPerUser = []
    if (tableNames.includes("Chatbot") && tableNames.includes("User")) {
      chatbotsPerUser = await sql`
        SELECT u.id, u.name, u.email, COUNT(c.id) as chatbot_count
        FROM "User" u
        LEFT JOIN "Chatbot" c ON u.id = c."userId"
        GROUP BY u.id, u.name, u.email
        ORDER BY chatbot_count DESC
      `
      console.log("Chatbots per user:", chatbotsPerUser)
    }

    return NextResponse.json({
      tables: tableNames,
      chatbotColumns: chatbotColumns,
      orphanedChatbots: orphanedChatbots,
      usersWithNoChatbots: usersWithNoChatbots,
      chatbotsPerUser: chatbotsPerUser,
      message: "Database repair check completed",
    })
  } catch (error) {
    console.error("Error in database repair:", error)
    return NextResponse.json(
      {
        error: "Database repair failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
