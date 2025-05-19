import { NextResponse } from "next/server"
import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      runtime: process.env.VERCEL ? "vercel" : "local",
      region: process.env.VERCEL_REGION || "unknown",
    },
    tests: {},
    connectionInfo: {},
  }

  try {
    // Get database URL (masked for security)
    const dbUrl = process.env.DATABASE_URL || ""
    if (!dbUrl) {
      results.error = "DATABASE_URL environment variable is not set"
      return NextResponse.json(results)
    }

    // Parse and mask the connection string
    try {
      const maskedDbUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, "//****:****@")
      const urlObj = new URL(dbUrl)

      results.connectionInfo = {
        host: urlObj.hostname,
        port: urlObj.port || "5432",
        database: urlObj.pathname.substring(1), // Remove leading slash
        ssl: !urlObj.searchParams.get("sslmode") || urlObj.searchParams.get("sslmode") !== "disable",
        masked_url: maskedDbUrl,
      }
    } catch (error) {
      results.connectionInfo.error = "Invalid DATABASE_URL format"
    }

    // Test 1: Direct SQL query using neon
    try {
      results.tests.directNeon = { status: "pending" }
      const sql = neon(process.env.DATABASE_URL)
      const startTime = Date.now()
      const directResult = await sql`SELECT 1 as test, current_timestamp as time, version() as version`
      const endTime = Date.now()

      results.tests.directNeon = {
        status: "success",
        latency: `${endTime - startTime}ms`,
        result: directResult[0],
      }
    } catch (error) {
      results.tests.directNeon = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 2: Connection pool
    try {
      results.tests.connectionPool = { status: "pending" }
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      const startTime = Date.now()
      const poolResult = await pool.query(
        "SELECT 1 as test, current_timestamp as time, pg_sleep(0.1), current_database() as database",
      )
      const endTime = Date.now()

      results.tests.connectionPool = {
        status: "success",
        latency: `${endTime - startTime}ms`,
        result: poolResult.rows[0],
      }

      // Close the pool
      await pool.end()
    } catch (error) {
      results.tests.connectionPool = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 3: Check tables
    try {
      results.tests.tables = { status: "pending" }
      const sql = neon(process.env.DATABASE_URL)
      const tables = await sql`
        SELECT table_name, 
               (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        ORDER BY table_name
      `

      results.tests.tables = {
        status: "success",
        count: tables.length,
        tables: tables.map((t: any) => ({
          name: t.table_name,
          columns: t.column_count,
        })),
      }
    } catch (error) {
      results.tests.tables = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 4: Network latency
    try {
      results.tests.networkLatency = { status: "pending" }
      const sql = neon(process.env.DATABASE_URL)

      const latencyTests = []
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now()
        await sql`SELECT 1`
        const endTime = Date.now()
        latencyTests.push(endTime - startTime)
      }

      results.tests.networkLatency = {
        status: "success",
        tests: latencyTests,
        average: latencyTests.reduce((a, b) => a + b, 0) / latencyTests.length,
      }
    } catch (error) {
      results.tests.networkLatency = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 5: SSL configuration
    try {
      results.tests.ssl = { status: "pending" }
      const sql = neon(process.env.DATABASE_URL)
      const sslResult = await sql`SHOW ssl`

      results.tests.ssl = {
        status: "success",
        enabled: sslResult[0].ssl === "on",
      }
    } catch (error) {
      results.tests.ssl = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error)
    return NextResponse.json(results, { status: 500 })
  }
}
