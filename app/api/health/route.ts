import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import prisma from "@/lib/db"

export async function GET() {
  const healthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL ? "set" : "not set",
    databaseConnection: "unknown",
    prismaConnection: "unknown",
    environmentVariables: {
      DATABASE_URL: process.env.DATABASE_URL ? "set" : "not set",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "set" : "not set",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "not set",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "set" : "not set",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "set" : "not set",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "set" : "not set",
    },
  }

  try {
    // Test direct SQL connection
    const sqlResult = await sql`SELECT 1 as test`
    healthStatus.databaseConnection = sqlResult[0].test === 1 ? "connected" : "error"
  } catch (error) {
    console.error("Health check SQL error:", error)
    healthStatus.databaseConnection = "error"
  }

  try {
    // Test Prisma connection
    const prismaResult = await prisma.$queryRaw`SELECT 1 as test`
    // @ts-ignore
    healthStatus.prismaConnection = prismaResult[0].test === 1 ? "connected" : "error"
  } catch (error) {
    console.error("Health check Prisma error:", error)
    healthStatus.prismaConnection = "error"
  }

  return NextResponse.json(healthStatus)
}
