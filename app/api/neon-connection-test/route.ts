import { NextResponse } from "next/server"
import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"
import { PrismaClient } from "@prisma/client"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  }

  try {
    // Get database URL (masked for security)
    const dbUrl = process.env.DATABASE_URL || ""
    if (!dbUrl) {
      results.error = "DATABASE_URL environment variable is not set"
      return NextResponse.json(results)
    }

    // Test 1: Direct connection with neon
    try {
      results.tests.directNeon = { status: "pending" }
      const sql = neon(dbUrl)
      const startTime = Date.now()
      const result = await sql`SELECT 1 as test`
      const endTime = Date.now()

      results.tests.directNeon = {
        status: "success",
        latency: endTime - startTime,
        result,
      }
    } catch (error) {
      results.tests.directNeon = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 2: Connection with Pool
    try {
      results.tests.pool = { status: "pending" }
      const pool = new Pool({ connectionString: dbUrl })
      const startTime = Date.now()
      const result = await pool.query("SELECT 1 as test")
      const endTime = Date.now()

      results.tests.pool = {
        status: "success",
        latency: endTime - startTime,
        result: result.rows,
      }

      await pool.end()
    } catch (error) {
      results.tests.pool = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 3: Connection with Prisma
    try {
      results.tests.prisma = { status: "pending" }
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      })

      const startTime = Date.now()
      // Use a raw query to test the connection
      const result = await prisma.$queryRaw`SELECT 1 as test`
      const endTime = Date.now()

      results.tests.prisma = {
        status: "success",
        latency: endTime - startTime,
        result,
      }

      await prisma.$disconnect()
    } catch (error) {
      results.tests.prisma = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 4: Connection with modified URL
    try {
      results.tests.modifiedUrl = { status: "pending" }

      // Try adding pooled=true parameter if not present
      let modifiedUrl = dbUrl
      const urlObj = new URL(dbUrl)
      if (!urlObj.searchParams.has("pooled")) {
        urlObj.searchParams.set("pooled", "true")
        modifiedUrl = urlObj.toString()
      }

      const sql = neon(modifiedUrl)
      const startTime = Date.now()
      const result = await sql`SELECT 1 as test`
      const endTime = Date.now()

      results.tests.modifiedUrl = {
        status: "success",
        latency: endTime - startTime,
        result,
        modifications: ["Added pooled=true parameter"],
      }
    } catch (error) {
      results.tests.modifiedUrl = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test 5: Connection with SSL disabled
    try {
      results.tests.noSsl = { status: "pending" }

      // Try disabling SSL
      let noSslUrl = dbUrl
      const urlObj = new URL(dbUrl)
      urlObj.searchParams.set("sslmode", "disable")
      noSslUrl = urlObj.toString()

      const sql = neon(noSslUrl)
      const startTime = Date.now()
      const result = await sql`SELECT 1 as test`
      const endTime = Date.now()

      results.tests.noSsl = {
        status: "success",
        latency: endTime - startTime,
        result,
      }
    } catch (error) {
      results.tests.noSsl = {
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
