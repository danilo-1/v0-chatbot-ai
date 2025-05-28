import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Buscar estatísticas de uso
    let usageStats = await prisma.userUsageStats.findUnique({
      where: {
        userId,
      },
    })

    // Se não existir, criar um novo registro
    if (!usageStats) {
      usageStats = await prisma.userUsageStats.create({
        data: {
          userId,
          messageCount: 0,
          chatbotCount: 0,
          lastResetDate: new Date(),
        },
      })
    }

    // Contar chatbots
    const chatbotCount = await prisma.chatbot.count({
      where: {
        userId,
      },
    })

    return NextResponse.json({
      usage: {
        messages: usageStats.messageCount,
        chatbots: chatbotCount,
      },
    })
  } catch (error) {
    console.error("Error fetching user usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
  }
}
