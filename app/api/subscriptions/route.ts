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

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Verificar se o plano existe
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verificar se o usuário já tem uma assinatura ativa
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "active",
      },
    })

    // Se existir, cancelar a assinatura atual
    if (existingSubscription) {
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: "canceled",
          endDate: new Date(),
        },
      })
    }

    // Criar nova assinatura
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "active",
        startDate: new Date(),
        // Definir data de término para 1 mês a partir de agora
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}

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

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}
