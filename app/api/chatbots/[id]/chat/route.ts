import type { NextRequest } from "next/server"
import { generateChatbotResponse, getChatbotById } from "@/backend/chatbot"

export const maxDuration = 30 // Allow streaming responses up to 30 seconds

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    return new Response(JSON.stringify({ error: "Chatbot not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { messages } = await req.json()

  try {
    const result = await generateChatbotResponse(params.id, messages)
    return result.toDataStreamResponse()
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
