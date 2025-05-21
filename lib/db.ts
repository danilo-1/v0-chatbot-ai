import { PrismaClient } from "@prisma/client"
import { neon, neonConfig } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

// Create a SQL client using Neon with error handling
export const sql = (query: string, ...args: any[]) => {
  try {
    const neonClient = neon(process.env.DATABASE_URL || "")
    return neonClient(query, ...args)
  } catch (error) {
    console.error("Neon SQL client error:", error)
    throw error
  }
}

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

// Add the named export 'db' that was missing
export const db = prisma

export default prisma
