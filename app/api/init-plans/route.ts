import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  return await initializePlans()
}

export async function POST() {
  return await initializePlans()
}

async function initializePlans() {
  try {
    // Create Plan table if it doesn't exist
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

    // Check if plans already exist
    const existingPlans = await sql`SELECT COUNT(*) as count FROM "Plan"`

    if (existingPlans[0]?.count === 0 || existingPlans[0]?.count === "0") {
      // Insert default plans
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
        ON CONFLICT (id) DO NOTHING
      `
    }

    return NextResponse.json({ success: true, message: "Plans initialized successfully" })
  } catch (error) {
    console.error("Error initializing plans:", error)
    return NextResponse.json({ error: "Failed to initialize plans" }, { status: 500 })
  }
}
