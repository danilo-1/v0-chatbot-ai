import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    auth: {
      status: "unknown",
      error: null,
      session: null,
    },
    database: {
      status: "unknown",
      error: null,
      neonConnection: "unknown",
      prismaConnection: "unknown",
      tables: [],
    },
    environmentVariables: {
      DATABASE_URL: process.env.DATABASE_URL ? "set" : "not set",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "set" : "not set",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "not set",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "set" : "not set",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "set" : "not set",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "set" : "not set",
    },
  }

  // Test auth
  try {
    const session = await getServerSession(authOptions)
    diagnostics.auth.status = session ? "authenticated" : "unauthenticated"
    diagnostics.auth.session = session
      ? {
          user: {
            name: session.user?.name,
            email: session.user?.email,
            role: session.user?.role,
          },
          expires: session.expires,
        }
      : null
  } catch (error) {
    diagnostics.auth.status = "error"
    diagnostics.auth.error = error instanceof Error ? error.message : String(error)
    console.error("Auth diagnostic error:", error)
  }

  // Test direct SQL connection
  try {
    const sqlResult = await sql`SELECT NOW() as time`
    diagnostics.database.neonConnection = "connected"
    diagnostics.database.status = "connected"

    // Get tables
    try {
      const tablesResult = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      diagnostics.database.tables = tablesResult.map((row) => row.table_name)
    } catch (innerError) {
      console.error("Error fetching tables:", innerError)
    }
  } catch (error) {
    diagnostics.database.neonConnection = "error"
    diagnostics.database.status = "error"
    diagnostics.database.error = error instanceof Error ? error.message : String(error)
    console.error("Database diagnostic error:", error)
  }

  return NextResponse.json(diagnostics)
}
