import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getChatbotById, updateChatbot, deleteChatbot } from "@/backend/chatbot"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
  }

  return NextResponse.json(chatbot)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
  }

  if (chatbot.userId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = await req.json()

  try {
    const updatedChatbot = await updateChatbot(params.id, data)
    return NextResponse.json(updatedChatbot)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update chatbot" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
  }

  if (chatbot.userId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    await deleteChatbot(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chatbot" }, { status: 500 })
  }
}
