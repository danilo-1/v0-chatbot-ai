import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateChatResponse } from "@/backend/chatbot"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const chatbotId = params.id

  // Verificar se o chatbot existe e é público
  const chatbot = await db.query(
    `
    SELECT * FROM "Chatbot" 
    WHERE id = $1 AND "isPublic" = true
  `,
    [chatbotId],
  )

  if (!chatbot || chatbot.length === 0) {
    return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Registrar a origem da API para telemetria
    const sessionId = `api-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const referrer = request.headers.get("referer") || "api"

    try {
      await db.query(
        `
        INSERT INTO "ChatSession" ("id", "chatbotId", "source", "referrer", "startedAt")
        VALUES ($1, $2, $3, $4, NOW())
      `,
        [sessionId, chatbotId, "api", referrer],
      )
    } catch (error) {
      console.error("Erro ao registrar sessão de API:", error)
    }

    // Gerar resposta do chatbot
    const chatbotData = chatbot[0]
    const response = await generateChatResponse({
      chatbotId,
      messages,
      temperature: chatbotData.temperature || 0.7,
      maxTokens: chatbotData.maxTokens || 500,
      modelId: chatbotData.modelId,
    })

    // Registrar mensagens para telemetria
    try {
      // Registrar mensagem do usuário
      const userMessage = messages[messages.length - 1]
      await db.query(
        `
        INSERT INTO "ChatMessage" ("id", "sessionId", "role", "content", "timestamp")
        VALUES ($1, $2, $3, $4, NOW())
      `,
        [
          `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sessionId,
          userMessage.role,
          userMessage.content,
        ],
      )

      // Registrar resposta do chatbot
      await db.query(
        `
        INSERT INTO "ChatMessage" ("id", "sessionId", "role", "content", "timestamp", "tokens", "modelId")
        VALUES ($1, $2, $3, $4, NOW(), $5, $6)
      `,
        [
          `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sessionId,
          "assistant",
          response.content,
          response.tokens || 0,
          response.modelId || chatbotData.modelId,
        ],
      )
    } catch (error) {
      console.error("Erro ao registrar mensagens de API:", error)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
