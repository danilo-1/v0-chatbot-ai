import { PrismaClient } from "@prisma/client"
import { neon, neonConfig } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
neonConfig.webSocketConstructor = globalThis.WebSocket

// Create a SQL client using Neon
export const sql = neon(process.env.DATABASE_URL!)

// Create a new PrismaClient instance
// Don't instantiate PrismaClient in development to avoid too many connections
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  // In development, use a global variable to avoid multiple instances
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
  }

  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    })
  }

  prisma = globalWithPrisma.prisma
}

export default prisma
