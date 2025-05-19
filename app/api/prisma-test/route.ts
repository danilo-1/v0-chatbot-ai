import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Test the connection with Prisma
    const startTime = Date.now()
    const result = await prisma.$queryRaw`SELECT 1 as test, current_timestamp as time, version() as version`
    const endTime = Date.now()

    // Get the tables
    const tables = await prisma.$queryRaw`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    return NextResponse.json({
      success: true,
      latency: `${endTime - startTime}ms`,
      result,
      tables,
    })
  } catch (error) {
    console.error("Prisma test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
