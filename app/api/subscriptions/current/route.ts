import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Buscar assinatura ativa do usuário
    const subscriptions = await sql`
      SELECT s.*, p.name as "planName", p."chatbotLimit", p."messageLimit"
      FROM "Subscription" s
      JOIN "Plan" p ON s."planId" = p.id
      WHERE s."userId" = ${session.user.id}
      AND s.status = 'active'
      ORDER BY s."createdAt" DESC
      LIMIT 1
    `

    if (subscriptions.length === 0) {
      // Se não tiver assinatura ativa, retornar plano gratuito
      return NextResponse.json({
        subscription: null,
      })
    }

    const subscription = subscriptions[0]

    // Formatar a resposta
    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        plan: {
          id: subscription.planId,
          name: subscription.planName,
        },
        chatbotLimit: subscription.chatbotLimit,
        messageLimit: subscription.messageLimit,
      },
    })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
