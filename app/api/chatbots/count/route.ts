import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const count = await prisma.chatbot.count({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error counting chatbots:", error)
    return NextResponse.json({ error: "Failed to count chatbots" }, { status: 500 })
  }
}
