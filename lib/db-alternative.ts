import { neon, neonConfig } from "@neondatabase/serverless"
import { PrismaClient } from "@prisma/client"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

// Configure neon with retries and timeouts
neonConfig.fetchConnectionCache = true
neonConfig.fetchRetryTimeout = 5000 // 5 seconds
neonConfig.fetchRetryMaxCount = 5

// Get the database URL
const dbUrl = process.env.DATABASE_URL || ""
if (!dbUrl) {
  console.error("DATABASE_URL environment variable is not set")
}

// Create a SQL client using Neon with better error handling
export const sql = (() => {
  try {
    const neonClient = neon(dbUrl)

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
const prismaClientSingleton = () => {
  try {
    // Try to parse the connection string to check if it's valid
    try {
      new URL(dbUrl)
    } catch (error) {
      console.error("Invalid DATABASE_URL format:", error)
    }

    // Create a new PrismaClient with custom logging
    return new PrismaClient({
      log: [
        { level: "query", emit: "event" },
        { level: "error", emit: "stdout" },
        { level: "warn", emit: "stdout" },
      ],
      errorFormat: "pretty",
    })
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error)
    throw error
  }
}

// Use type for global to avoid TypeScript errors
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// Use global variable in development to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Create or reuse the Prisma client
let prisma: PrismaClientSingleton

try {
  prisma = globalForPrisma.prisma ?? prismaClientSingleton()

  // Add query logging in development
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore - The event property exists but TypeScript doesn't know about it
    prisma.$on("query", (e: any) => {
      console.log(`Query: ${e.query}`)
      console.log(`Duration: ${e.duration}ms`)
    })
  }

  // Only set the global variable in development
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
  }
} catch (error) {
  console.error("Error initializing Prisma client:", error)
  throw error
}

// Test the connection on initialization without blocking
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Database connection test successful")
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Export the Prisma client
export default prisma
