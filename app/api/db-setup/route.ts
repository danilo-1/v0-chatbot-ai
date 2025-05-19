import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("Starting database setup")

    // Check if User table exists
    const userTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'User'
      )
    `

    if (!userTableCheck[0].exists) {
      console.log("Creating User table")
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
    }

    // Check if Chatbot table exists
    const chatbotTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Chatbot'
      )
    `

    if (!chatbotTableCheck[0].exists) {
      console.log("Creating Chatbot table")
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
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )
      `
    }

    // Check if Account table exists
    const accountTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Account'
      )
    `

    if (!accountTableCheck[0].exists) {
      console.log("Creating Account table")
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
    }

    // Check if Session table exists
    const sessionTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Session'
      )
    `

    if (!sessionTableCheck[0].exists) {
      console.log("Creating Session table")
      await sql`
        CREATE TABLE "Session" (
          id TEXT PRIMARY KEY,
          "sessionToken" TEXT UNIQUE NOT NULL,
          "userId" TEXT NOT NULL,
          expires TIMESTAMP WITH TIME ZONE NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )
      `
    }

    // Check if GlobalConfig table exists
    const globalConfigTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'GlobalConfig'
      )
    `

    if (!globalConfigTableCheck[0].exists) {
      console.log("Creating GlobalConfig table")
      await sql`
        CREATE TABLE "GlobalConfig" (
          id TEXT PRIMARY KEY,
          "globalPrompt" TEXT DEFAULT 'You are a helpful assistant for websites. Answer questions based on the provided context.',
          "allowedTopics" TEXT DEFAULT 'customer service, product information, general help',
          "blockedTopics" TEXT DEFAULT 'illegal activities, harmful content, personal information',
          "maxTokens" INTEGER DEFAULT 2000,
          temperature FLOAT DEFAULT 0.7
        )
      `

      // Insert default global config
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
    }

    // List all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    return NextResponse.json({
      success: true,
      message: "Database setup completed",
      tables: tables.map((t) => t.table_name),
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        error: "Failed to set up database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
