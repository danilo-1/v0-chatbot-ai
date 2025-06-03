import type { NextRequest } from "next/server"
import { generateChatbotResponse, getChatbotById } from "@/backend/chatbot"
import { headers } from "next/headers"

export const maxDuration = 30 // Allow streaming responses up to 30 seconds

// Adicionar suporte para requisições OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // 24 horas
    },
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // Configurar cabeçalhos CORS para permitir requisições de qualquer origem
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    return new Response(JSON.stringify({ error: "Chatbot not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  }

  try {
    const { messages, sessionId, userId, visitorId } = await req.json()

    // Get request metadata for telemetry
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const referer = headersList.get("referer") || ""
    const ip = headersList.get("x-forwarded-for") || req.ip || ""
    const source = "widget" // Marcar a origem como widget

    const result = await generateChatbotResponse(params.id, messages, {
      sessionId,
      userId,
      visitorId,
      source,
      referrer: referer,
      userAgent,
      ipAddress: ip,
    })

    // Adicionar cabeçalhos CORS à resposta
    const response = result.toDataStreamResponse()

    // Não podemos modificar diretamente os cabeçalhos de uma Response em Next.js,
    // então vamos criar uma nova resposta com os cabeçalhos CORS
    const responseBody = await response.text()

    return new Response(responseBody, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error("Erro ao gerar resposta:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  }
}
