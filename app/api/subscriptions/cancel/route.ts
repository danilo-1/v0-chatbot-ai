import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verificar se a assinatura existe e pertence ao usuário
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id,
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found or does not belong to user" }, { status: 404 })
    }

    // Cancelar a assinatura
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "canceled",
        endDate: new Date(),
      },
    })

    return NextResponse.json({ subscription: updatedSubscription })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
