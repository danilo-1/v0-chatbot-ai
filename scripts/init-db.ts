import { sql } from "@/lib/db"

async function main() {
  try {
    // Check if global config exists
    const globalConfig = await sql`SELECT * FROM "GlobalConfig" WHERE id = 'global'`

    if (globalConfig.length === 0) {
      // Create global config
      await sql`
        INSERT INTO "GlobalConfig" (
          id, 
          "globalPrompt", 
          "allowedTopics", 
          "blockedTopics", 
          "maxTokens", 
          temperature
        ) VALUES (
          'global',
          'You are a helpful assistant for websites. Answer questions based on the provided context. Be friendly, concise, and helpful. If you don''t know the answer, say so politely and suggest contacting support. Always stay on topic and provide accurate information based on the knowledge base provided.',
          'customer service, product information, business hours, pricing, shipping, returns, general help',
          'illegal activities, harmful content, personal information, political opinions, medical advice',
          2000,
          0.7
        )
      `
      console.log("Created global config")
    } else {
      console.log("Global config already exists")
    }

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
