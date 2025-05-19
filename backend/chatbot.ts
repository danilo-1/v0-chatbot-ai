import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import prisma from "@/lib/db"
import { sql } from "@/lib/db"
import { toExtensibleObject, toExtensibleArray } from "@/lib/utils"

export async function getChatbotById(id: string) {
  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id },
      include: {
        model: true,
      },
    })
    return toExtensibleObject(chatbot)
  } catch (error) {
    console.error("Error fetching chatbot by ID:", error)
    return null
  }
}

export async function getChatbotsByUserId(userId: string) {
  try {
    const chatbots = await prisma.chatbot.findMany({
      where: { userId },
    })
    return toExtensibleArray(chatbots)
  } catch (error) {
    console.error("Error fetching chatbots by user ID:", error)
    return []
  }
}

export async function getPublicChatbots() {
  try {
    const chatbots = await prisma.chatbot.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })
    return toExtensibleArray(chatbots)
  } catch (error) {
    console.error("Error fetching public chatbots:", error)
    return []
  }
}

export async function createChatbot(data: {
  name: string
  description?: string
  imageUrl?: string
  isPublic?: boolean
  userId: string
  temperature?: number
  maxTokens?: number
  knowledgeBase?: string
  customPrompt?: string
  modelId?: string
}) {
  try {
    // Se não for fornecido um modelId, use o modelo padrão
    if (!data.modelId) {
      const globalConfig = await getGlobalConfig()
      data.modelId = globalConfig.defaultModelId
    }

    const chatbot = await prisma.chatbot.create({
      data,
    })
    return toExtensibleObject(chatbot)
  } catch (error) {
    console.error("Error creating chatbot:", error)
    throw error
  }
}

export async function updateChatbot(
  id: string,
  data: {
    name?: string
    description?: string
    imageUrl?: string
    isPublic?: boolean
    temperature?: number
    maxTokens?: number
    knowledgeBase?: string
    customPrompt?: string
    modelId?: string
  },
) {
  try {
    const chatbot = await prisma.chatbot.update({
      where: { id },
      data,
    })
    return toExtensibleObject(chatbot)
  } catch (error) {
    console.error(`Error updating chatbot with id ${id}:`, error)
    throw error
  }
}

export async function deleteChatbot(id: string) {
  try {
    const chatbot = await prisma.chatbot.delete({
      where: { id },
    })
    return toExtensibleObject(chatbot)
  } catch (error) {
    console.error(`Error deleting chatbot with id ${id}:`, error)
    throw error
  }
}

export async function getGlobalConfig() {
  try {
    // Use direct SQL query instead of Prisma
    const result = await sql`SELECT * FROM "GlobalConfig" WHERE id = 'global'`

    // If no config exists, create one
    if (result.length === 0) {
      const newConfig = await sql`
        INSERT INTO "GlobalConfig" (
          id, 
          "globalPrompt", 
          "allowedTopics", 
          "blockedTopics", 
          "maxTokens", 
          temperature,
          "defaultModelId"
        ) VALUES (
          'global',
          'You are a helpful assistant for websites. Answer questions based on the provided context.',
          'customer service, product information, general help',
          'illegal activities, harmful content, personal information',
          2000,
          0.7,
          'gpt-4o'
        )
        RETURNING *
      `
      return toExtensibleObject(newConfig[0])
    }

    return toExtensibleObject(result[0])
  } catch (error) {
    console.error("Error fetching global config:", error)
    // Return a default config if there's an error
    return {
      id: "global",
      globalPrompt: "You are a helpful assistant for websites. Answer questions based on the provided context.",
      allowedTopics: "customer service, product information, general help",
      blockedTopics: "illegal activities, harmful content, personal information",
      maxTokens: 2000,
      temperature: 0.7,
      defaultModelId: "gpt-4o",
    }
  }
}

export async function updateGlobalConfig(data: {
  globalPrompt?: string
  allowedTopics?: string
  blockedTopics?: string
  maxTokens?: number
  temperature?: number
  defaultModelId?: string
}) {
  try {
    // Use direct SQL query instead of Prisma
    const result = await sql`
      UPDATE "GlobalConfig"
      SET 
        "globalPrompt" = ${data.globalPrompt || null},
        "allowedTopics" = ${data.allowedTopics || null},
        "blockedTopics" = ${data.blockedTopics || null},
        "maxTokens" = ${data.maxTokens || null},
        "temperature" = ${data.temperature || null},
        "defaultModelId" = ${data.defaultModelId || null}
      WHERE id = 'global'
      RETURNING *
    `

    return toExtensibleObject(result[0])
  } catch (error) {
    console.error("Error updating global config:", error)
    throw error
  }
}

export async function getAIModels() {
  try {
    const models = await prisma.aIModel.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return toExtensibleArray(models)
  } catch (error) {
    console.error("Error fetching AI models:", error)
    return []
  }
}

export async function getAIModelById(id: string) {
  try {
    const model = await prisma.aIModel.findUnique({
      where: { id },
    })
    return toExtensibleObject(model)
  } catch (error) {
    console.error(`Error fetching AI model with id ${id}:`, error)
    return null
  }
}

export async function getDefaultAIModel() {
  try {
    const model = await prisma.aIModel.findFirst({
      where: { isDefault: true },
    })

    if (!model) {
      // Fallback to gpt-4o if no default is set
      const fallbackModel = await prisma.aIModel.findUnique({
        where: { id: "gpt-4o" },
      })
      return toExtensibleObject(fallbackModel)
    }

    return toExtensibleObject(model)
  } catch (error) {
    console.error("Error fetching default AI model:", error)
    // Return a default model if there's an error
    return {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "openai",
      modelId: "gpt-4o",
      isActive: true,
      isDefault: true,
      maxTokens: 4096,
    }
  }
}

export async function createAIModel(data: {
  id: string
  name: string
  provider: string
  modelId: string
  isActive?: boolean
  isDefault?: boolean
  maxTokens?: number
}) {
  try {
    // Se este modelo for definido como padrão, remova o padrão de outros modelos
    if (data.isDefault) {
      await prisma.aIModel.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    const model = await prisma.aIModel.create({
      data,
    })
    return toExtensibleObject(model)
  } catch (error) {
    console.error("Error creating AI model:", error)
    throw error
  }
}

export async function updateAIModel(
  id: string,
  data: {
    name?: string
    provider?: string
    modelId?: string
    isActive?: boolean
    isDefault?: boolean
    maxTokens?: number
  },
) {
  try {
    // Se este modelo for definido como padrão, remova o padrão de outros modelos
    if (data.isDefault) {
      await prisma.aIModel.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }

    const model = await prisma.aIModel.update({
      where: { id },
      data,
    })
    return toExtensibleObject(model)
  } catch (error) {
    console.error(`Error updating AI model with id ${id}:`, error)
    throw error
  }
}

export async function deleteAIModel(id: string) {
  try {
    // Verifique se o modelo está sendo usado por algum chatbot
    const chatbotsUsingModel = await prisma.chatbot.count({
      where: { modelId: id },
    })

    if (chatbotsUsingModel > 0) {
      throw new Error(`Cannot delete model: it is being used by ${chatbotsUsingModel} chatbot(s)`)
    }

    // Verifique se o modelo é o padrão na configuração global
    const globalConfig = await getGlobalConfig()
    if (globalConfig.defaultModelId === id) {
      throw new Error("Cannot delete model: it is set as the default model in global settings")
    }

    // Verifique se é o único modelo padrão
    if ((await prisma.aIModel.count({ where: { isDefault: true, id } })) > 0) {
      const otherModelsCount = await prisma.aIModel.count({
        where: { id: { not: id } },
      })

      if (otherModelsCount === 0) {
        throw new Error("Cannot delete model: it is the only model in the system")
      }

      // Se for o modelo padrão e houver outros modelos, defina outro como padrão
      const anotherModel = await prisma.aIModel.findFirst({
        where: { id: { not: id } },
      })

      if (anotherModel) {
        await updateAIModel(anotherModel.id, { isDefault: true })
      }
    }

    const model = await prisma.aIModel.delete({
      where: { id },
    })
    return toExtensibleObject(model)
  } catch (error) {
    console.error(`Error deleting AI model with id ${id}:`, error)
    throw error
  }
}

export async function generateChatbotResponse(chatbotId: string, messages: { role: string; content: string }[]) {
  try {
    // Get chatbot and global config
    const [chatbot, globalConfig] = await Promise.all([getChatbotById(chatbotId), getGlobalConfig()])

    if (!chatbot) {
      throw new Error("Chatbot not found")
    }

    // Determine which model to use
    let modelId = "gpt-4o" // Fallback default

    if (chatbot.modelId) {
      // Use chatbot-specific model if set
      modelId = chatbot.modelId
    } else if (globalConfig.defaultModelId) {
      // Otherwise use global default model
      modelId = globalConfig.defaultModelId
    }

    // Get the model details
    const model = await getAIModelById(modelId)

    if (!model || !model.isActive) {
      // Fallback to gpt-4o if model not found or not active
      modelId = "gpt-4o"
    }

    // Combine global and chatbot-specific configurations
    const systemPrompt = `${globalConfig.globalPrompt || ""}

${chatbot.customPrompt || ""}

${
  chatbot.knowledgeBase
    ? `Knowledge Base:
${chatbot.knowledgeBase}`
    : ""
}

Allowed Topics: ${globalConfig.allowedTopics || ""}
Blocked Topics: ${globalConfig.blockedTopics || ""}

You are a chatbot for ${chatbot.name}. Answer questions based on the provided knowledge base.
If you don't know the answer, say so politely.`

    // Create a new array with the system message at the beginning
    const messagesWithSystem = [{ role: "system", content: systemPrompt }, ...messages]

    // Generate response using the selected model
    const result = streamText({
      model: openai(modelId),
      messages: messagesWithSystem,
      temperature: chatbot.temperature || globalConfig.temperature || 0.7,
      maxTokens: chatbot.maxTokens || globalConfig.maxTokens || 2000,
    })

    return result
  } catch (error) {
    console.error("Error generating chatbot response:", error)
    throw error
  }
}
