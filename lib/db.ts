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

// Log database connection information (without sensitive data)
const dbUrl = process.env.DATABASE_URL || ""
if (!dbUrl) {
  console.error("DATABASE_URL environment variable is not set")
} else {
  try {
    const maskedUrl = dbUrl.replace(/:[^:@]*@/, ":****@")
    const urlObj = new URL(dbUrl)
    console.log(`Database connection info: ${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`)
  } catch (error) {
    console.error("Invalid DATABASE_URL format:", error)
  }
}

// Create a connection pool for better performance and reliability
let pool: Pool | null = null
try {
  pool = new Pool({ connectionString: dbUrl })
  console.log("Database connection pool initialized")
} catch (error) {
  console.error("Failed to initialize connection pool:", error)
}

// Create a SQL client using Neon with better error handling
export const sql = async (query: string, ...args: any[]) => {
  try {
    if (!pool) {
      throw new Error("Database connection pool not initialized")
    }

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
  try {
    return new PrismaClient({
      log: ["error", "warn"],
      errorFormat: "pretty",
      datasources: {
        db: {
          url: dbUrl,
        },
      },
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

  // Only set the global variable in development
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
  }
} catch (error) {
  console.error("Error initializing Prisma client:", error)
  throw error
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
