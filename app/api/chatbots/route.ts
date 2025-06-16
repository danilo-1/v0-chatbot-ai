import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

/**
 * @swagger
 * /api/chatbots:
 *   get:
 *     summary: Lista todos os chatbots do usuário
 *     tags: [Chatbots]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de chatbots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chatbot'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Cria um novo chatbot
 *     tags: [Chatbots]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do chatbot
 *                 example: "Assistente de Vendas"
 *               description:
 *                 type: string
 *                 description: Descrição do chatbot
 *                 example: "Chatbot para auxiliar nas vendas"
 *               instructions:
 *                 type: string
 *                 description: Instruções para o chatbot
 *                 example: "Você é um assistente de vendas especializado..."
 *               model:
 *                 type: string
 *                 description: Modelo de IA a ser usado
 *                 example: "gpt-4"
 *               temperature:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 2
 *                 description: Temperatura do modelo
 *                 example: 0.7
 *               maxTokens:
 *                 type: integer
 *                 minimum: 1
 *                 description: Máximo de tokens por resposta
 *                 example: 1000
 *               isPublic:
 *                 type: boolean
 *                 description: Se o chatbot é público
 *                 example: false
 *     responses:
 *       201:
 *         description: Chatbot criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chatbot'
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
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const chatbots = await db.chatbot.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(chatbots)
  } catch (error) {
    console.error("Erro ao buscar chatbots:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, instructions, model, temperature, maxTokens, isPublic } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Nome e descrição são obrigatórios" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const chatbot = await db.chatbot.create({
      data: {
        name,
        description,
        instructions: instructions || "",
        model: model || "gpt-3.5-turbo",
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000,
        isPublic: isPublic || false,
        userId: user.id,
      },
    })

    return NextResponse.json(chatbot, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar chatbot:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
