import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const chatbot = await prisma.chatbot.findUnique({
      where: { id },
      include: {
        model: true,
      },
    })

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    // Check if the chatbot is public or if the user is the owner
    const session = await getServerSession(authOptions)
    if (!chatbot.isPublic && (!session || session.user.id !== chatbot.userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("Error fetching chatbot:", error)
    return NextResponse.json({ error: "Failed to fetch chatbot" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const data = await req.json()

    // Get the current chatbot to check ownership and preserve AI settings
    const currentChatbot = await prisma.chatbot.findUnique({
      where: { id },
    })

    if (!currentChatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    // Check if the user is the owner or an admin
    const isAdmin = session.user.role === "admin"
    if (currentChatbot.userId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If the user is not an admin, preserve the AI settings
    const updateData = { ...data }
    if (!isAdmin) {
      // Remove AI settings from the update data
      delete updateData.customPrompt
      delete updateData.modelId
    }

    const chatbot = await prisma.chatbot.update({
      where: { id },
      data: updateData,
      include: {
        model: true,
      },
    })

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("Error updating chatbot:", error)
    return NextResponse.json({ error: "Failed to update chatbot" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Get the current chatbot to check ownership
    const currentChatbot = await prisma.chatbot.findUnique({
      where: { id },
    })

    if (!currentChatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    // Check if the user is the owner or an admin
    const isAdmin = session.user.role === "admin"
    if (currentChatbot.userId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.chatbot.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chatbot:", error)
    return NextResponse.json({ error: "Failed to delete chatbot" }, { status: 500 })
  }
}
