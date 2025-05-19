import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { toExtensibleArray } from "@/lib/utils"

export async function GET() {
  try {
    // Verificar se as tabelas existem
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Verificar a estrutura da tabela Chatbot
    const chatbotColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Chatbot'
      ORDER BY ordinal_position
    `

    // Verificar a estrutura da tabela User
    const userColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'User'
      ORDER BY ordinal_position
    `

    // Verificar a estrutura da tabela AIModel
    const aiModelColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'AIModel'
      ORDER BY ordinal_position
    `

    // Contar registros em cada tabela
    const chatbotCount = await sql`SELECT COUNT(*) FROM "Chatbot"`
    const userCount = await sql`SELECT COUNT(*) FROM "User"`
    const aiModelCount = await sql`SELECT COUNT(*) FROM "AIModel"`

    // Verificar se há chatbots
    const chatbots = await sql`
      SELECT id, name, "userId"
      FROM "Chatbot"
      LIMIT 5
    `

    // Verificar se há usuários
    const users = await sql`
      SELECT id, name, email
      FROM "User"
      LIMIT 5
    `

    // Verificar se há modelos de IA
    const aiModels = await sql`
      SELECT id, name, provider
      FROM "AIModel"
      LIMIT 5
    `

    return NextResponse.json({
      tables: toExtensibleArray(tables),
      chatbotColumns: toExtensibleArray(chatbotColumns),
      userColumns: toExtensibleArray(userColumns),
      aiModelColumns: toExtensibleArray(aiModelColumns),
      counts: {
        chatbots: chatbotCount[0].count,
        users: userCount[0].count,
        aiModels: aiModelCount[0].count,
      },
      samples: {
        chatbots: toExtensibleArray(chatbots),
        users: toExtensibleArray(users),
        aiModels: toExtensibleArray(aiModels),
      },
    })
  } catch (error) {
    console.error("Error checking database structure:", error)
    return NextResponse.json({ error: "Failed to check database structure" }, { status: 500 })
  }
}
