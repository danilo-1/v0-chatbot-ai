import { NextResponse } from "next/server"
import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

export async function GET() {
  try {
    // Get database URL (masked for security)
    const dbUrl = process.env.DATABASE_URL || ""
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set",
      })
    }

    // Test direct connection with neon
    let directResult
    try {
      const sql = neon(dbUrl)
      directResult = await sql`SELECT 1 as test`
    } catch (error) {
      return NextResponse.json({
        success: false,
        method: "direct",
        error: error instanceof Error ? error.message : String(error),
      })
    }

    // Test connection with Pool
    let poolResult
    try {
      const pool = new Pool({ connectionString: dbUrl })
      poolResult = await pool.query("SELECT 1 as test")
      await pool.end()
    } catch (error) {
      return NextResponse.json({
        success: false,
        method: "pool",
        error: error instanceof Error ? error.message : String(error),
      })
    }

    return NextResponse.json({
      success: true,
      directResult,
      poolResult: poolResult.rows,
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
