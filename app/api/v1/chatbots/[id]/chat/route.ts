import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { generateChatResponse } from "@/backend/chatbot"

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Configurar CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    // Obter o ID do chatbot
    const chatbotId = params.id

    // Usar o cliente neon diretamente
    const sql = neon(process.env.DATABASE_URL!)

    // Verificar se o chatbot existe e é público
    const chatbot = await sql`
      SELECT * FROM "Chatbot" 
      WHERE id = ${chatbotId} AND "isPublic" = true
    `

    if (!chatbot || chatbot.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Chatbot not found or not public" }), {
        status: 404,
        headers: corsHeaders,
      })
    }

    // Obter os dados do corpo da requisição
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse(JSON.stringify({ error: "Invalid request body. 'messages' array is required." }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    // Registrar a sessão e a mensagem para telemetria
    const visitorId = request.headers.get("x-visitor-id") || "anonymous"
    const referrer = request.headers.get("referer") || request.headers.get("origin") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Gerar resposta do chatbot
    const chatbotData = chatbot[0]
    const response = await generateChatResponse({
      chatbot: chatbotData,
      messages,
      visitorId,
      referrer,
      userAgent,
    })

    // Retornar a resposta
    return new NextResponse(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new NextResponse(JSON.stringify({ error: "An error occurred while processing your request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
}
