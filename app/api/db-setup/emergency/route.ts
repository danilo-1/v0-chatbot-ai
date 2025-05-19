import { NextResponse } from "next/server"
import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

// Configure neon to use WebSockets for better connection stability
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

// Configure neon with retries and timeouts
neonConfig.fetchConnectionCache = true
neonConfig.fetchRetryTimeout = 5000 // 5 seconds
neonConfig.fetchRetryMaxCount = 5

export async function GET(req: Request) {
  try {
    console.log("Starting emergency database diagnostics...")

    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL || ""

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is not set",
        },
        { status: 500 },
      )
    }

    // Mask the password in the database URL for logging
    const maskedUrl = databaseUrl.replace(/:[^:@]*@/, ":****@")
    console.log("Database URL (masked):", maskedUrl)

    // Test direct connection using neon
    console.log("Testing direct connection using neon...")
    let directConnectionResult
    try {
      const directSql = neon(databaseUrl)
      directConnectionResult = await directSql`SELECT 1 as test`
      console.log("Direct connection successful:", directConnectionResult)
    } catch (error) {
      console.error("Direct connection failed:", error)
      directConnectionResult = { error: error instanceof Error ? error.message : String(error) }
    }

    // Test connection using pool
    console.log("Testing connection using pool...")
    let poolConnectionResult
    try {
      const pool = new Pool({ connectionString: databaseUrl })
      poolConnectionResult = await pool.query("SELECT 1 as test")
      console.log("Pool connection successful:", poolConnectionResult)
      await pool.end()
    } catch (error) {
      console.error("Pool connection failed:", error)
      poolConnectionResult = { error: error instanceof Error ? error.message : String(error) }
    }

    // Get environment information
    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION,
      VERCEL_URL: process.env.VERCEL_URL,
    }

    return NextResponse.json({
      success: true,
      message: "Emergency database diagnostics completed",
      environment,
      directConnection: directConnectionResult,
      poolConnection: poolConnectionResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Emergency database diagnostics error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log("Starting emergency database setup...")

    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL || ""

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is not set",
        },
        { status: 500 },
      )
    }

    // Create a direct SQL client
    const sql = neon(databaseUrl)

    // Check if tables exist
    console.log("Checking if tables exist...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const tableNames = tables.map((t: any) => t.table_name)
    console.log(`Found tables: ${tableNames.join(", ") || "none"}`)

    // Create User table if it doesn't exist
    if (!tableNames.includes("User")) {
      console.log("Creating User table...")
      await sql`
        CREATE TABLE "User" (
          id TEXT PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE,
          "emailVerified" TIMESTAMP WITH TIME ZONE,
          image TEXT,
          role TEXT DEFAULT 'user'
        )
      `
      console.log("User table created successfully")
    }

    // Create Chatbot table if it doesn't exist
    if (!tableNames.includes("Chatbot")) {
      console.log("Creating Chatbot table...")
      await sql`
        CREATE TABLE "Chatbot" (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          "imageUrl" TEXT,
          "isPublic" BOOLEAN DEFAULT false,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "userId" TEXT NOT NULL,
          temperature FLOAT DEFAULT 0.7,
          "maxTokens" INTEGER DEFAULT 1000,
          "knowledgeBase" TEXT DEFAULT '',
          "customPrompt" TEXT DEFAULT '',
          "modelId" TEXT,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )
      `
      console.log("Chatbot table created successfully")
    }

    // Create AIModel table if it doesn't exist
    if (!tableNames.includes("AIModel")) {
      console.log("Creating AIModel table...")
      await sql`
        CREATE TABLE "AIModel" (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          provider TEXT NOT NULL,
          "modelId" TEXT NOT NULL,
          "isActive" BOOLEAN DEFAULT true,
          "isDefault" BOOLEAN DEFAULT false,
          "maxTokens" INTEGER DEFAULT 4096,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("AIModel table created successfully")

      // Insert default models
      console.log("Inserting default AI models...")
      await sql`
        INSERT INTO "AIModel" (id, name, provider, "modelId", "isActive", "isDefault", "maxTokens")
        VALUES 
        ('gpt-4o', 'GPT-4o', 'openai', 'gpt-4o', true, true, 4096),
        ('gpt-4-turbo', 'GPT-4 Turbo', 'openai', 'gpt-4-turbo', true, false, 4096),
        ('gpt-3.5-turbo', 'GPT-3.5 Turbo', 'openai', 'gpt-3.5-turbo', true, false, 4096)
        ON CONFLICT (id) DO NOTHING
      `
      console.log("Default AI models inserted successfully")
    }

    // Create GlobalConfig table if it doesn't exist
    if (!tableNames.includes("GlobalConfig")) {
      console.log("Creating GlobalConfig table...")
      await sql`
        CREATE TABLE "GlobalConfig" (
          id TEXT PRIMARY KEY,
          "globalPrompt" TEXT DEFAULT 'You are a helpful assistant for websites. Answer questions based on the provided context.',
          "allowedTopics" TEXT DEFAULT 'customer service, product information, general help',
          "blockedTopics" TEXT DEFAULT 'illegal activities, harmful content, personal information',
          "maxTokens" INTEGER DEFAULT 2000,
          temperature FLOAT DEFAULT 0.7,
          "defaultModelId" TEXT
        )
      `
      console.log("GlobalConfig table created successfully")

      // Insert default global config
      console.log("Inserting default global config...")
      await sql`
        INSERT INTO "GlobalConfig" (
          id, 
          "globalPrompt", 
          "allowedTopics", 
          "blockedTopics", 
          "maxTokens", 
          temperature,
          "defaultModelId"
        ) VALUES (
          'global',
          'You are a helpful assistant for websites. Answer questions based on the provided context. Be friendly, concise, and helpful. If you don''t know the answer, say so politely and suggest contacting support. Always stay on topic and provide accurate information based on the knowledge base provided.',
          'customer service, product information, business hours, pricing, shipping, returns, general help',
          'illegal activities, harmful content, personal information, political opinions, medical advice',
          2000,
          0.7,
          'gpt-4o'
        )
        ON CONFLICT (id) DO NOTHING
      `
      console.log("Default global config inserted successfully")
    } else {
      // Update GlobalConfig to add defaultModelId if it doesn't exist
      const globalConfig = await sql`SELECT * FROM "GlobalConfig" WHERE id = 'global'`

      if (globalConfig.length > 0 && globalConfig[0].defaultModelId === null) {
        console.log("Updating GlobalConfig to set default model...")
        await sql`
          UPDATE "GlobalConfig"
          SET "defaultModelId" = 'gpt-4o'
          WHERE id = 'global'
        `
        console.log("GlobalConfig updated successfully")
      }
    }

    // Create other necessary tables (Account, Session, etc.)
    if (!tableNames.includes("Account")) {
      console.log("Creating Account table...")
      await sql`
        CREATE TABLE "Account" (
          id TEXT PRIMARY KEY,
          "userId" TEXT NOT NULL,
          type TEXT NOT NULL,
          provider TEXT NOT NULL,
          "providerAccountId" TEXT NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INTEGER,
          token_type TEXT,
          scope TEXT,
          id_token TEXT,
          session_state TEXT,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
          UNIQUE(provider, "providerAccountId")
        )
      `
      console.log("Account table created successfully")
    }

    if (!tableNames.includes("Session")) {
      console.log("Creating Session table...")
      await sql`
        CREATE TABLE "Session" (
          id TEXT PRIMARY KEY,
          "sessionToken" TEXT UNIQUE NOT NULL,
          "userId" TEXT NOT NULL,
          expires TIMESTAMP WITH TIME ZONE NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )
      `
      console.log("Session table created successfully")
    }

    if (!tableNames.includes("VerificationToken")) {
      console.log("Creating VerificationToken table...")
      await sql`
        CREATE TABLE "VerificationToken" (
          identifier TEXT NOT NULL,
          token TEXT NOT NULL,
          expires TIMESTAMP WITH TIME ZONE NOT NULL,
          UNIQUE(identifier, token)
        )
      `
      console.log("VerificationToken table created successfully")
    }

    // Test the connection
    const testResult = await sql`SELECT 1 as test`

    return NextResponse.json({
      success: true,
      message: "Emergency database setup completed successfully",
      tables: tableNames,
      test: testResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Emergency database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
