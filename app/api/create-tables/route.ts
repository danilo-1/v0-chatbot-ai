import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    // Create all necessary tables
    await createAllTables()
    return NextResponse.json({ success: true, message: "All tables created successfully" })
  } catch (error) {
    console.error("Error creating tables:", error)
    return NextResponse.json(
      {
        error: "Failed to create tables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function createAllTables() {
  // Create Account table
  await sql`
    CREATE TABLE IF NOT EXISTS "Account" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
      UNIQUE(provider, "providerAccountId")
    )
  `

  // Create Session table
  await sql`
    CREATE TABLE IF NOT EXISTS "Session" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "sessionToken" TEXT UNIQUE NOT NULL,
      "userId" TEXT NOT NULL,
      expires TIMESTAMP NOT NULL
    )
  `

  // Create User table
  await sql`
    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT,
      email TEXT UNIQUE,
      "emailVerified" TIMESTAMP,
      image TEXT,
      role TEXT DEFAULT 'user',
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `

  // Create VerificationToken table
  await sql`
    CREATE TABLE IF NOT EXISTS "VerificationToken" (
      identifier TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires TIMESTAMP NOT NULL,
      UNIQUE(identifier, token)
    )
  `

  // Create Chatbot table
  await sql`
    CREATE TABLE IF NOT EXISTS "Chatbot" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      description TEXT,
      "imageUrl" TEXT,
      "isPublic" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW(),
      "userId" TEXT NOT NULL,
      temperature FLOAT DEFAULT 0.7,
      "maxTokens" INTEGER DEFAULT 1000,
      "knowledgeBase" TEXT DEFAULT '',
      "customPrompt" TEXT DEFAULT '',
      "modelId" TEXT
    )
  `

  // Create GlobalConfig table
  await sql`
    CREATE TABLE IF NOT EXISTS "GlobalConfig" (
      id TEXT PRIMARY KEY DEFAULT 'global',
      "globalPrompt" TEXT DEFAULT 'You are a helpful assistant for websites. Answer questions based on the provided context.',
      "allowedTopics" TEXT DEFAULT 'customer service, product information, general help',
      "blockedTopics" TEXT DEFAULT 'illegal activities, harmful content, personal information',
      "maxTokens" INTEGER DEFAULT 2000,
      temperature FLOAT DEFAULT 0.7
    )
  `

  // Create Plan table
  await sql`
    CREATE TABLE IF NOT EXISTS "Plan" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price FLOAT NOT NULL,
      currency TEXT DEFAULT 'BRL',
      interval TEXT DEFAULT 'month',
      "maxChatbots" INTEGER NOT NULL,
      "maxMessagesPerMonth" INTEGER NOT NULL,
      features TEXT[] DEFAULT '{}',
      "isActive" BOOLEAN DEFAULT true,
      "isFree" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `

  // Create Subscription table
  await sql`
    CREATE TABLE IF NOT EXISTS "Subscription" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "userId" TEXT NOT NULL,
      "planId" TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      "currentPeriodStart" TIMESTAMP DEFAULT NOW(),
      "currentPeriodEnd" TIMESTAMP NOT NULL,
      "cancelAtPeriodEnd" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `

  // Create UserUsageStats table
  await sql`
    CREATE TABLE IF NOT EXISTS "UserUsageStats" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "userId" TEXT UNIQUE NOT NULL,
      "messageCount" INTEGER DEFAULT 0,
      "chatbotCount" INTEGER DEFAULT 0,
      "lastResetDate" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `

  // Create AIModel table
  await sql`
    CREATE TABLE IF NOT EXISTS "AIModel" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      modelid TEXT NOT NULL,
      provider TEXT NOT NULL,
      description TEXT,
      maxtokens INTEGER DEFAULT 2000,
      isactive BOOLEAN DEFAULT true,
      isdefault BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `

  // Insert default data
  await insertDefaultData()
}

async function insertDefaultData() {
  // Insert global config if not exists
  await sql`
    INSERT INTO "GlobalConfig" (
      id, 
      "globalPrompt", 
      "allowedTopics", 
      "blockedTopics", 
      "maxTokens", 
      temperature
    ) VALUES (
      'global',
      'You are a helpful assistant for websites. Answer questions based on the provided context. Be friendly, concise, and helpful. If you don''t know the answer, say so politely and suggest contacting support. Always stay on topic and provide accurate information based on the knowledge base provided.',
      'customer service, product information, business hours, pricing, shipping, returns, general help',
      'illegal activities, harmful content, personal information, political opinions, medical advice',
      2000,
      0.7
    )
    ON CONFLICT (id) DO NOTHING
  `

  // Insert default plans if not exist
  const existingPlans = await sql`SELECT COUNT(*) as count FROM "Plan"`

  if (existingPlans[0]?.count === 0 || existingPlans[0]?.count === "0") {
    await sql`
      INSERT INTO "Plan" (
        name, description, price, "maxChatbots", "maxMessagesPerMonth", features, "isFree"
      ) VALUES 
      (
        'Gratuito',
        'Plano básico para começar',
        0,
        1,
        100,
        ARRAY['1 chatbot', '100 mensagens/mês', 'Suporte básico'],
        true
      ),
      (
        'Pro',
        'Plano profissional',
        29.90,
        5,
        1000,
        ARRAY['5 chatbots', '1000 mensagens/mês', 'Suporte prioritário', 'Customização avançada'],
        false
      ),
      (
        'Enterprise',
        'Plano empresarial',
        99.90,
        20,
        10000,
        ARRAY['20 chatbots', '10000 mensagens/mês', 'Suporte 24/7', 'API personalizada', 'Integração completa'],
        false
      )
    `
  }
}
