import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const chatbotId = url.searchParams.get("chatbotId")

    if (!chatbotId) {
      return NextResponse.json({ error: "Missing chatbot ID" }, { status: 400 })
    }

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        model: true,
      },
    })

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("Error fetching chatbot settings:", error)
    return NextResponse.json({ error: "Failed to fetch chatbot settings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { id, customPrompt, modelId } = data

    if (!id) {
      return NextResponse.json({ error: "Missing chatbot ID" }, { status: 400 })
    }

    // Update only AI settings
    const chatbot = await prisma.chatbot.update({
      where: { id },
      data: {
        customPrompt,
        modelId,
      },
      include: {
        model: true,
      },
    })

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("Error updating chatbot settings:", error)
    return NextResponse.json({ error: "Failed to update chatbot settings" }, { status: 500 })
  }
}
