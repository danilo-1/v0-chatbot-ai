import { NextResponse } from "next/server"
import prisma from "@/prisma/client"

export async function GET() {
  try {
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
