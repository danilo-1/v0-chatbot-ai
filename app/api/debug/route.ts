import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Forçar modo dinâmico para evitar erro de renderização estática
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check database connection
    let dbStatus = "unknown"
    let dbError = null
    try {
      const result = await sql`SELECT NOW() as time`
      dbStatus = "connected"
    } catch (error) {
      dbStatus = "error"
      dbError = error instanceof Error ? error.message : String(error)
    }

    // Check tables
    let tables = []
    try {
      const tablesResult = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      tables = tablesResult.map((row) => row.table_name)
    } catch (error) {
      console.error("Error fetching tables:", error)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      auth: {
        session: session ? "active" : "none",
        user: session?.user
          ? {
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
            }
          : null,
      },
      database: {
        status: dbStatus,
        error: dbError,
        tables,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "set" : "not set",
        DATABASE_URL: process.env.DATABASE_URL ? "set" : "not set",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "not set",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "set" : "not set",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "set" : "not set",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "set" : "not set",
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        error: "Debug API error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
