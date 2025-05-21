import type { NextRequest } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { neon } from "@neondatabase/serverless"

// Configurar cabeçalhos CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Adicionar suporte para requisições OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obter o ID do chatbot
    const chatbotId = params.id

    // Conectar ao banco de dados
    const sql = neon(process.env.DATABASE_URL!)

    // Buscar o chatbot
    const chatbots = await sql`
      SELECT * FROM "Chatbot" 
      WHERE id = ${chatbotId} AND "isPublic" = true
    `

    if (!chatbots || chatbots.length === 0) {
      return new Response(JSON.stringify({ error: "Chatbot not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      })
    }

    const chatbot = chatbots[0]

    // Obter o modelo de IA associado ao chatbot
    const modelId = chatbot.modelId
    let model = "gpt-4o"
    let provider = "openai"

    if (modelId) {
      const models = await sql`
        SELECT * FROM "AIModel" 
        WHERE id = ${modelId}
      `

      if (models && models.length > 0) {
        model = models[0].modelName || "gpt-4o"
        provider = models[0].provider || "openai"
      }
    }

    // Obter as mensagens da requisição
    const { messages } = await req.json()

    // Preparar o sistema prompt
    const systemPrompt = chatbot.systemPrompt || "You are a helpful assistant."

    // Gerar a resposta usando o AI SDK
    const { text } = await generateText({
      model: openai(model),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    })

    // Registrar a interação no banco de dados (opcional)
    // Aqui você pode adicionar código para registrar a conversa

    // Retornar a resposta
    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  }
}
