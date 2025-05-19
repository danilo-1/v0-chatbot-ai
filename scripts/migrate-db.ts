import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Running database migrations...")
    await execAsync("npx prisma migrate deploy")

    console.log("Checking if global config exists...")
    const globalConfig = await prisma.globalConfig.findUnique({
      where: { id: "global" },
    })

    if (!globalConfig) {
      console.log("Creating global config...")
      await prisma.globalConfig.create({
        data: {
          id: "global",
          globalPrompt: `You are a helpful assistant for websites. Answer questions based on the provided context.
          
Be friendly, concise, and helpful. If you don't know the answer, say so politely and suggest contacting support.

Always stay on topic and provide accurate information based on the knowledge base provided.`,
          allowedTopics:
            "customer service, product information, business hours, pricing, shipping, returns, general help",
          blockedTopics:
            "illegal activities, harmful content, personal information, political opinions, medical advice",
          maxTokens: 2000,
          temperature: 0.7,
        },
      })
      console.log("Global config created successfully")
    } else {
      console.log("Global config already exists")
    }

    console.log("Database setup complete")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
