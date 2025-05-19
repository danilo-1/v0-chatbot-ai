import { NextResponse } from "next/server"
import { checkDatabaseConnection, sql } from "@/lib/db"

export async function GET() {
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection()

    // Get database URL (masked for security)
    const dbUrl = process.env.DATABASE_URL || ""
    const maskedDbUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, "//****:****@")

    // Get database tables
    let tables = []
    try {
      const result = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      tables = result.map((row: any) => row.table_name)
    } catch (error) {
      console.error("Error fetching tables:", error)
    }

    // Get Prisma version
    let prismaVersion = "Unknown"
    try {
      const pkg = require("@prisma/client/package.json")
      prismaVersion = pkg.version
    } catch (error) {
      console.error("Error getting Prisma version:", error)
    }

    // Get Node.js version
    const nodeVersion = process.version

    // Get environment
    const environment = process.env.NODE_ENV || "development"

    // Check if required tables exist
    const requiredTables = ["User", "Chatbot", "GlobalConfig", "AIModel", "Account", "Session"]
    const missingTables = requiredTables.filter((table) => !tables.includes(table))

    return NextResponse.json({
      status: isConnected ? "connected" : "disconnected",
      database: {
        url: maskedDbUrl,
        tables,
        missingTables,
      },
      environment,
      versions: {
        node: nodeVersion,
        prisma: prismaVersion,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database diagnostics error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
