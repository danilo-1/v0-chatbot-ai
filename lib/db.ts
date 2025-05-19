import { neonConfig } from "@neondatabase/serverless"
import { PrismaClient } from "@prisma/client"
import { Pool } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

// Configure neon with retries and timeouts
neonConfig.fetchConnectionCache = true
neonConfig.fetchRetryTimeout = 5000 // 5 seconds
neonConfig.fetchRetryMaxCount = 5

// Create a connection pool for better performance and reliability
const connectionString = process.env.DATABASE_URL || ""
const pool = new Pool({ connectionString })

// Create a SQL client using Neon with better error handling
export const sql = async (query: string, ...args: any[]) => {
  try {
    // Use the pool for better connection management
    return await pool.query(query, args)
  } catch (error) {
    console.error("SQL query error:", error)
    console.error("Query:", query)
    throw error
  }
}

// Create a new PrismaClient instance with better error handling and connection settings
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Add connection timeout and retry settings
    __internal: {
      engine: {
        connectionTimeout: 10000, // 10 seconds
        retry: {
          maxRetries: 5,
          initialDelay: 500, // 500ms
          maxDelay: 5000, // 5 seconds
        },
      },
    },
  })
}

// Use type for global to avoid TypeScript errors
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// Use global variable in development to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Create or reuse the Prisma client
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Only set the global variable in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Test the connection on initialization without blocking
async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Database connection test successful")
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Export a function to check connection status
export const checkDatabaseConnection = testConnection

// Export the Prisma client
export default prisma
