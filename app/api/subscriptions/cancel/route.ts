import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Atualizar assinatura atual para cancelar no final do período
    const subscription = await prisma.subscription.updateMany({
      where: {
        userId: session.user.id,
        status: "active",
      },
      data: {
        cancelAtPeriodEnd: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
    })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
