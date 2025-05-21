import type { NextRequest } from "next/server"
import { generateChatbotResponse, getChatbotById } from "@/backend/chatbot"
import { headers } from "next/headers"

export const maxDuration = 30 // Allow streaming responses up to 30 seconds

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    return new Response(JSON.stringify({ error: "Chatbot not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { messages, sessionId, userId, visitorId } = await req.json()

  // Get request metadata for telemetry
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  const referer = headersList.get("referer") || ""
  const ip = headersList.get("x-forwarded-for") || req.ip || ""
  const source = new URL(req.url).pathname.includes("/chatbot/") ? "public" : "playground"

  try {
    const result = await generateChatbotResponse(params.id, messages, {
      sessionId,
      userId,
      visitorId,
      source,
      referrer: referer,
      userAgent,
      ipAddress: ip,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
