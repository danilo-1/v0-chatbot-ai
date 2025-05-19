import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if GlobalConfig table exists and has the global record
    const globalConfig = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'GlobalConfig'
      )
    `

    if (!globalConfig[0].exists) {
      // Create the GlobalConfig table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS "GlobalConfig" (
          id TEXT PRIMARY KEY,
          "globalPrompt" TEXT DEFAULT 'You are a helpful assistant for websites. Answer questions based on the provided context.',
          "allowedTopics" TEXT DEFAULT 'customer service, product information, general help',
          "blockedTopics" TEXT DEFAULT 'illegal activities, harmful content, personal information',
          "maxTokens" INTEGER DEFAULT 2000,
          temperature FLOAT DEFAULT 0.7
        )
      `

      // Insert the global record
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

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
