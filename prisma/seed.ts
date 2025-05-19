import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create global config
  await prisma.globalConfig.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      globalPrompt: `You are a helpful assistant for websites. Answer questions based on the provided context.
      
Be friendly, concise, and helpful. If you don't know the answer, say so politely and suggest contacting support.

Always stay on topic and provide accurate information based on the knowledge base provided.`,
      allowedTopics: "customer service, product information, business hours, pricing, shipping, returns, general help",
      blockedTopics: "illegal activities, harmful content, personal information, political opinions, medical advice",
      maxTokens: 2000,
      temperature: 0.7,
    },
  })

  console.log("Database seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
