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

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(subscription || { status: "none" })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Verificar se o plano existe
    const plan = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
    })

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Cancelar assinatura atual se existir
    await prisma.subscription.updateMany({
      where: {
        userId: session.user.id,
        status: "active",
      },
      data: {
        status: "canceled",
        cancelAtPeriodEnd: true,
      },
    })

    // Criar nova assinatura
    const now = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // Assinatura de 1 mês

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId: planId,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
      },
      include: {
        plan: true,
      },
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
