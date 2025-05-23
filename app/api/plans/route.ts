import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const plans = await prisma.plan.findMany({
      orderBy: {
        price: "asc",
      },
    })

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
