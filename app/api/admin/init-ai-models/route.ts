import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if there are any models in the AIModel table
    const modelsCount = await sql`
      SELECT COUNT(*) as count FROM "AIModel"
    `

    if (modelsCount[0].count > 0) {
      return NextResponse.json({ message: "AI models already exist", count: modelsCount[0].count })
    }

    // Add default models
    await sql`
      INSERT INTO "AIModel" (
        id, 
        name, 
        modelid, 
        provider, 
        isdefault, 
        isactive, 
        maxtokens, 
        createdat, 
        updatedat
      ) VALUES 
        (gen_random_uuid(), 'GPT-4o', 'gpt-4o', 'openai', true, true, 4000, NOW(), NOW()),
        (gen_random_uuid(), 'GPT-3.5 Turbo', 'gpt-3.5-turbo', 'openai', false, true, 4000, NOW(), NOW()),
        (gen_random_uuid(), 'Claude 3 Opus', 'claude-3-opus-20240229', 'anthropic', false, true, 4000, NOW(), NOW()),
        (gen_random_uuid(), 'Claude 3 Sonnet', 'claude-3-sonnet-20240229', 'anthropic', false, true, 4000, NOW(), NOW()),
        (gen_random_uuid(), 'Gemini Pro', 'gemini-pro', 'google', false, true, 4000, NOW(), NOW()),
        (gen_random_uuid(), 'Mistral Large', 'mistral-large-latest', 'mistral', false, true, 4000, NOW(), NOW()),
        (gen_random_uuid(), 'Llama 3 70B', 'llama-3-70b-8192', 'groq', false, true, 4000, NOW(), NOW())
    `

    return NextResponse.json({ success: true, message: "Default AI models initialized" })
  } catch (error) {
    console.error("Error initializing AI models:", error)
    return NextResponse.json({ error: "Failed to initialize AI models" }, { status: 500 })
  }
}
