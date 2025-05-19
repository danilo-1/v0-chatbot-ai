import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import prisma from "@/lib/db"
import { sql } from "@/lib/db"

export async function getChatbotById(id: string) {
  return prisma.chatbot.findUnique({
    where: { id },
  })
}

export async function getChatbotsByUserId(userId: string) {
  return prisma.chatbot.findMany({
    where: { userId },
  })
}

export async function getPublicChatbots() {
  return prisma.chatbot.findMany({
    where: { isPublic: true },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })
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
}) {
  return prisma.chatbot.create({
    data,
  })
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
  },
) {
  return prisma.chatbot.update({
    where: { id },
    data,
  })
}

export async function deleteChatbot(id: string) {
  return prisma.chatbot.delete({
    where: { id },
  })
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
          temperature
        ) VALUES (
          'global',
          'You are a helpful assistant for websites. Answer questions based on the provided context.',
          'customer service, product information, general help',
          'illegal activities, harmful content, personal information',
          2000,
          0.7
        )
        RETURNING *
      `
      return newConfig[0]
    }

    return result[0]
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
    }
  }
}

export async function updateGlobalConfig(data: {
  globalPrompt?: string
  allowedTopics?: string
  blockedTopics?: string
  maxTokens?: number
  temperature?: number
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
        "temperature" = ${data.temperature || null}
      WHERE id = 'global'
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error updating global config:", error)
    throw error
  }
}

// In the generateChatbotResponse function, update the code to use the AIModel table
export async function generateChatbotResponse(chatbotId: string, messages: { role: string; content: string }[]) {
  // Get chatbot and global config
  const [chatbot, globalConfig] = await Promise.all([getChatbotById(chatbotId), getGlobalConfig()])

  if (!chatbot) {
    throw new Error("Chatbot not found")
  }

  // Get the AI model to use
  let aiModel = null

  if (chatbot.modelId) {
    // If chatbot has a specific model assigned, use that
    try {
      const modelResult = await sql`
        SELECT * FROM "AIModel"
        WHERE id = ${chatbot.modelId} AND "isactive" = true
      `
      if (modelResult.length > 0) {
        aiModel = modelResult[0]
      }
    } catch (error) {
      console.error("Error fetching chatbot model:", error)
    }
  }

  // If no specific model or the model is inactive, use the default model
  if (!aiModel) {
    try {
      const defaultModelResult = await sql`
        SELECT * FROM "AIModel"
        WHERE "isdefault" = true AND "isactive" = true
      `
      if (defaultModelResult.length > 0) {
        aiModel = defaultModelResult[0]
      }
    } catch (error) {
      console.error("Error fetching default model:", error)
    }
  }

  // Fallback to gpt-4o if no model is found
  const modelId = aiModel?.modelid || "gpt-4o"
  const maxTokens = aiModel?.maxtokens || chatbot.maxTokens || 2000

  // Combine global and chatbot-specific configurations
  const systemPrompt = `${globalConfig.globalPrompt}

${chatbot.customPrompt}

Knowledge Base:
${chatbot.knowledgeBase}

Allowed Topics: ${globalConfig.allowedTopics}
Blocked Topics: ${globalConfig.blockedTopics}

You are a chatbot for ${chatbot.name}. Answer questions based on the provided knowledge base.
If you don't know the answer, say so politely.`

  // Create a new array with the system message at the beginning
  const messagesWithSystem = [{ role: "system", content: systemPrompt }, ...messages]

  // Generate response using the selected model
  const result = streamText({
    model: openai(modelId),
    messages: messagesWithSystem,
    temperature: chatbot.temperature,
    maxTokens: maxTokens,
  })

  return result
}
