import { neon, neonConfig } from "@neondatabase/serverless"
import { PrismaClient } from "@prisma/client"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
}

// Create a SQL client using Neon with better error handling
export const sql = (() => {
  try {
    const neonClient = neon(process.env.DATABASE_URL || "")

    // Return a wrapped function with error handling
    return async (query: string, ...args: any[]) => {
      try {
        return await neonClient(query, ...args)
      } catch (error) {
        console.error("SQL query error:", error)
        console.error("Query:", query)
        throw error
      }
    }
  } catch (error) {
    console.error("Neon SQL client initialization error:", error)

    // Return a function that will throw an error when called
    return async () => {
      throw new Error("Database client not initialized properly")
    }
  }
})()

// Create a new PrismaClient instance with better error handling
let prisma: PrismaClient

try {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({
      log: ["error"],
      errorFormat: "pretty",
    })
  } else {
    // In development, use a global variable to avoid multiple instances
    const globalWithPrisma = global as typeof globalThis & {
      prisma: PrismaClient
    }

    if (!globalWithPrisma.prisma) {
      globalWithPrisma.prisma = new PrismaClient({
        log: ["query", "error", "warn"],
        errorFormat: "pretty",
      })
    }

    prisma = globalWithPrisma.prisma
  }
} catch (error) {
  console.error("Prisma client initialization error:", error)
  // Create a minimal client that logs errors but doesn't crash the app
  prisma = new PrismaClient({
    log: ["error"],
    errorFormat: "pretty",
  })
}

// Test the connection on initialization
async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Database connection test successful")
  } catch (error) {
    console.error("Database connection test failed:", error)
  }
}

// Don't block the app startup, but test the connection
if (process.env.NODE_ENV === "production") {
  testConnection()
}

export default prisma
