import { PrismaClient } from "@prisma/client"
import { neon, neonConfig } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

// Create a SQL client using Neon with error handling
export const sql = async (...args: any[]) => {
  const connectionString = process.env.DATABASE_URL || ""

  // Verificar se a string de conexão é válida
  if (!connectionString) {
    console.error("DATABASE_URL is not defined")
    return []
  }

  if (!/^postgres(ql)?:\/\//.test(connectionString)) {
    console.error("Invalid DATABASE_URL format: must start with 'postgres://' or 'postgresql://'")
    return []
  }

  try {
    const neonClient = neon(connectionString)

    // Se o primeiro argumento for uma string (query SQL)
    if (typeof args[0] === "string") {
      return await neonClient(args[0], ...args.slice(1))
    }

    // Se for um template string (sql`query`)
    return await neonClient(...args)
  } catch (error) {
    console.error("Neon SQL client error:", error)
    // Retornar um array vazio em vez de lançar erro
    return []
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
