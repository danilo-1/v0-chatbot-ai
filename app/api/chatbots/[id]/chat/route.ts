import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

/**
 * @swagger
 * /api/chatbots/{id}/chat:
 *   post:
 *     summary: Envia uma mensagem para o chatbot
 *     tags: [Chat]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do chatbot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                       description: Papel do remetente
 *                     content:
 *                       type: string
 *                       description: Conteúdo da mensagem
 *                 example:
 *                   - role: "user"
 *                     content: "Olá, como você pode me ajudar?"
 *               sessionId:
 *                 type: string
 *                 description: ID da sessão (opcional)
 *                 example: "session_123"
 *     responses:
 *       200:
 *         description: Resposta do chatbot (stream)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Chatbot não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { messages, sessionId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensagens são obrigatórias" }, { status: 400 })
    }

    const chatbot = await db.chatbot.findFirst({
      where: {
        id: params.id,
        OR: [{ user: { email: session.user.email } }, { isPublic: true }],
      },
    })

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot não encontrado" }, { status: 404 })
    }

    // Salvar mensagem do usuário
    const userMessage = messages[messages.length - 1]
    if (userMessage.role === "user") {
      await db.chatMessage.create({
        data: {
          content: userMessage.content,
          role: "user",
          chatbotId: chatbot.id,
          sessionId: sessionId || `session_${Date.now()}`,
        },
      })
    }

    const result = await streamText({
      model: openai(chatbot.model || "gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: chatbot.instructions || "Você é um assistente útil.",
        },
        ...messages,
      ],
      temperature: chatbot.temperature || 0.7,
      maxTokens: chatbot.maxTokens || 1000,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Erro no chat:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
