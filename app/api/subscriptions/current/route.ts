import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Buscar assinatura ativa
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "active",
      },
      include: {
        plan: true,
      },
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("Error fetching current subscription:", error)
    return NextResponse.json({ error: "Failed to fetch current subscription" }, { status: 500 })
  }
}
