import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { checkUserLimits, assignFreePlanToUser } from "@/lib/usage-limits"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Garantir que o usuário tenha pelo menos o plano gratuito
    await assignFreePlanToUser(userId)

    // Obter limites e uso
    const limits = await checkUserLimits(userId)

    return NextResponse.json(limits)
  } catch (error) {
    console.error("Error fetching user limits:", error)
    return NextResponse.json({ error: "Failed to fetch user limits" }, { status: 500 })
  }
}
