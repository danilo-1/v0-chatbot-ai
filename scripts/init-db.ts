import { sql } from "@/lib/db"

async function main() {
  try {
    console.log("Starting database initialization...")

    // Check if tables exist
    console.log("Checking if tables exist...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const tableNames = tables.map((t) => t.table_name)
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
          modelId TEXT NOT NULL,
          isActive BOOLEAN DEFAULT true,
          isDefault BOOLEAN DEFAULT false,
          maxTokens INTEGER DEFAULT 4096,
          createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
          "defaultModelId" TEXT REFERENCES "AIModel"(id)
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

    console.log("Database initialization completed successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
