import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { createChatbot, getPublicChatbots, getChatbotsByUserId } from "@/backend/chatbot"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const searchParams = req.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (userId && session?.user?.id === userId) {
    // Get user's chatbots
    const chatbots = await getChatbotsByUserId(userId)
    return NextResponse.json(chatbots)
  } else {
    // Get public chatbots
    const chatbots = await getPublicChatbots()
    return NextResponse.json(chatbots)
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  try {
    const chatbot = await createChatbot({
      ...data,
      userId: session.user.id,
    })

    return NextResponse.json(chatbot)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create chatbot" }, { status: 500 })
  }
}
