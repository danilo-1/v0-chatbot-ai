import { NextResponse } from "next/server"
import { neon, neonConfig } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const url = new URL(request.url)
    const sslmode = url.searchParams.get("sslmode") || "require"
    const pooled = url.searchParams.get("pooled") || "true"

    // Get database URL
    const dbUrl = process.env.DATABASE_URL || ""
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set",
      })
    }

    // Modify the connection string
    const urlObj = new URL(dbUrl)
    urlObj.searchParams.set("sslmode", sslmode)
    urlObj.searchParams.set("pooled", pooled)
    const modifiedUrl = urlObj.toString()

    // Test the connection
    const sql = neon(modifiedUrl)
    const result = await sql`SELECT 1 as test, current_timestamp as time`

    return NextResponse.json({
      success: true,
      parameters: {
        sslmode,
        pooled,
      },
      result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
