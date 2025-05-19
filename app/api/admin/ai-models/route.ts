import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const models = await prisma.aIModel.findMany({
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    })

    return NextResponse.json(models)
  } catch (error) {
    console.error("Error fetching AI models:", error)
    return NextResponse.json({ error: "Failed to fetch AI models" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { id, name, provider, modelId, maxTokens, isActive, isDefault } = data

    // Validate required fields
    if (!id || !name || !provider || !modelId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If setting as default, unset any existing default
    if (isDefault) {
      await prisma.aIModel.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    // Create new model
    const model = await prisma.aIModel.create({
      data: {
        id,
        name,
        provider,
        modelId,
        maxTokens: maxTokens || 4096,
        isActive: isActive !== undefined ? isActive : true,
        isDefault: isDefault || false,
      },
    })

    // If this is the first model or set as default, update global config
    if (isDefault) {
      await prisma.globalConfig.update({
        where: { id: "global" },
        data: { defaultModelId: model.id },
      })
    }

    return NextResponse.json(model)
  } catch (error) {
    console.error("Error creating AI model:", error)
    return NextResponse.json({ error: "Failed to create AI model" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { id, name, provider, modelId, maxTokens, isActive, isDefault } = data

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: "Missing model ID" }, { status: 400 })
    }

    // If setting as default, unset any existing default
    if (isDefault) {
      await prisma.aIModel.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }

    // Update model
    const model = await prisma.aIModel.update({
      where: { id },
      data: {
        name,
        provider,
        modelId,
        maxTokens,
        isActive,
        isDefault,
        updatedAt: new Date(),
      },
    })

    // If set as default, update global config
    if (isDefault) {
      await prisma.globalConfig.update({
        where: { id: "global" },
        data: { defaultModelId: model.id },
      })
    }

    return NextResponse.json(model)
  } catch (error) {
    console.error("Error updating AI model:", error)
    return NextResponse.json({ error: "Failed to update AI model" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing model ID" }, { status: 400 })
    }

    // Check if model is default
    const model = await prisma.aIModel.findUnique({
      where: { id },
    })

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    if (model.isDefault) {
      return NextResponse.json({ error: "Cannot delete default model" }, { status: 400 })
    }

    // Check if model is in use by any chatbots
    const chatbotsUsingModel = await prisma.chatbot.count({
      where: { modelId: id },
    })

    if (chatbotsUsingModel > 0) {
      return NextResponse.json({ error: "Model is in use by chatbots" }, { status: 400 })
    }

    // Delete model
    await prisma.aIModel.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting AI model:", error)
    return NextResponse.json({ error: "Failed to delete AI model" }, { status: 500 })
  }
}
