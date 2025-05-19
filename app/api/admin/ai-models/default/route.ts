import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Get the default model ID from global config
    const globalConfig = await prisma.globalConfig.findUnique({
      where: { id: "global" },
      select: { defaultModelId: true },
    })

    if (!globalConfig?.defaultModelId) {
      // If no default model is set, get the first active model
      const firstActiveModel = await prisma.aIModel.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      })

      if (!firstActiveModel) {
        return NextResponse.json({ error: "No active AI models found" }, { status: 404 })
      }

      return NextResponse.json(firstActiveModel)
    }

    // Get the default model
    const defaultModel = await prisma.aIModel.findUnique({
      where: { id: globalConfig.defaultModelId },
    })

    if (!defaultModel) {
      return NextResponse.json({ error: "Default model not found" }, { status: 404 })
    }

    return NextResponse.json(defaultModel)
  } catch (error) {
    console.error("Error fetching default AI model:", error)
    return NextResponse.json({ error: "Failed to fetch default AI model" }, { status: 500 })
  }
}
