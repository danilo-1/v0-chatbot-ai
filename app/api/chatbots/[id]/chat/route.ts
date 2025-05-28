import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { generateChatbotResponse } from "@/backend/chatbot"
import { getToken } from "next-auth/jwt"
import { incrementMessageCount, checkUserLimits } from "@/lib/usage-limits"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const chatbotId = params.id
    const { messages, sessionData } = await req.json()

    // Verificar autenticação
    const session = await getServerSession(authOptions)
    const token = await getToken({ req })
    const userId = session?.user?.id || token?.sub || token?.id

    // Se o usuário estiver autenticado, verificar limites
    if (userId) {
      const limits = await checkUserLimits(userId)

      // Se excedeu o limite de mensagens, retornar erro
      if (!limits.isWithinMessageLimit) {
        return NextResponse.json(
          {
            error: "Limite de mensagens excedido",
            limitExceeded: true,
            limits,
          },
          { status: 402 }, // Payment Required
        )
      }

      // Incrementar contagem de mensagens
      await incrementMessageCount(userId)
    }

    // Gerar resposta do chatbot
    const result = await generateChatbotResponse(chatbotId, messages, {
      ...sessionData,
      userId,
    })

    // Retornar resposta como stream
    return new Response(result.stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to generate response", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
