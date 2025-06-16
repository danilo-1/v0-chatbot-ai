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
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      console.error("DATABASE_URL is not defined")
      return new Response(
        JSON.stringify({ error: "DATABASE_URL not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      )
    }

    const sql = neon(connectionString)

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

    // Buscar a configuração global
    const globalConfig = await sql`
      SELECT * FROM "GlobalConfig" 
      WHERE id = 'global'
    `

    const globalSettings =
      globalConfig.length > 0
        ? globalConfig[0]
        : {
            globalPrompt: "You are a helpful assistant for websites. Answer questions based on the provided context.",
            allowedTopics: "customer service, product information, general help",
            blockedTopics: "illegal activities, harmful content, personal information",
            maxTokens: 2000,
            temperature: 0.7,
          }

    // Obter o modelo de IA associado ao chatbot
    const modelId = chatbot.modelId
    let model = "gpt-4o"
    let provider = "openai"
    let maxTokens = chatbot.maxTokens || globalSettings.maxTokens || 2000
    const temperature = chatbot.temperature || globalSettings.temperature || 0.7

    if (modelId) {
      const models = await sql`
        SELECT * FROM "AIModel" 
        WHERE id = ${modelId} AND "isactive" = true
      `

      if (models && models.length > 0) {
        model = models[0].modelid || "gpt-4o"
        provider = models[0].provider || "openai"
        // Usar maxTokens do modelo se disponível
        if (models[0].maxtokens) {
          maxTokens = models[0].maxtokens
        }
      } else {
        // Se o modelo específico não for encontrado ou estiver inativo, buscar o modelo padrão
        const defaultModels = await sql`
          SELECT * FROM "AIModel"
          WHERE "isdefault" = true AND "isactive" = true
        `

        if (defaultModels && defaultModels.length > 0) {
          model = defaultModels[0].modelid || "gpt-4o"
          provider = defaultModels[0].provider || "openai"
          if (defaultModels[0].maxtokens) {
            maxTokens = defaultModels[0].maxtokens
          }
        }
      }
    }

    // Obter as mensagens da requisição
    const { messages } = await req.json()

    // Preparar o sistema prompt combinando configurações globais e específicas do chatbot
    const systemPrompt = `${globalSettings.globalPrompt}

${chatbot.customPrompt || ""}

Knowledge Base:
${chatbot.knowledgeBase || ""}

Allowed Topics: ${globalSettings.allowedTopics}
Blocked Topics: ${globalSettings.blockedTopics}

You are a chatbot for ${chatbot.name}. Answer questions based on the provided knowledge base.
If you don't know the answer, say so politely.`

    console.log("Using model:", model)
    console.log("System prompt:", systemPrompt)

    // Gerar a resposta usando o AI SDK
    const { text } = await generateText({
      model: openai(model),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: temperature,
      maxTokens: maxTokens,
    })

    // Registrar a interação no banco de dados (opcional)
    try {
      // Criar uma sessão para esta interação
      const sessionResult = await sql`
        INSERT INTO "ChatSession" ("chatbotId", "visitorId", "source", "referrer", "userAgent")
        VALUES (
          ${chatbotId}, 
          ${"widget-" + Math.random().toString(36).substring(2, 15)}, 
          'widget', 
          ${req.headers.get("referer") || ""}, 
          ${req.headers.get("user-agent") || ""}
        )
        RETURNING id
      `

      if (sessionResult && sessionResult.length > 0) {
        const sessionId = sessionResult[0].id

        // Registrar a mensagem do usuário
        if (messages && messages.length > 0) {
          const userMessage = messages[messages.length - 1]
          await sql`
            INSERT INTO "ChatMessage" ("sessionId", "role", "content")
            VALUES (${sessionId}, ${userMessage.role}, ${userMessage.content})
          `
        }

        // Registrar a resposta do assistente
        await sql`
          INSERT INTO "ChatMessage" ("sessionId", "role", "content", "modelId")
          VALUES (${sessionId}, 'assistant', ${text}, ${modelId || null})
        `

        // Atualizar métricas diárias
        const today = new Date().toISOString().split("T")[0]
        await sql`
          INSERT INTO "DailyMetrics" ("date", "chatbotId", "messageCount", "sessionCount")
          VALUES (${today}, ${chatbotId}, 2, 1)
          ON CONFLICT ("date", "chatbotId") 
          DO UPDATE SET 
            "messageCount" = "DailyMetrics"."messageCount" + 2,
            "sessionCount" = "DailyMetrics"."sessionCount" + 1
        `
      }
    } catch (error) {
      console.error("Error logging chat interaction:", error)
      // Continue mesmo se o registro falhar
    }

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
    const message =
      error instanceof Error ? error.message : "Failed to generate response"
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  }
}
