import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ChatPlayground } from "@/components/chat-playground"

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { theme?: string; initialMessage?: string; referrer?: string }
}) {
  const chatbotId = params.id
  const theme = searchParams.theme || "light"
  const initialMessage = searchParams.initialMessage || ""
  const referrer = searchParams.referrer || ""

  try {
    // Verificar se o chatbot existe e é público
    const chatbot = await db.query(
      `
      SELECT * FROM "Chatbot" 
      WHERE id = $1 AND "isPublic" = true
    `,
      [chatbotId],
    )

    if (!chatbot || chatbot.length === 0) {
      return notFound()
    }

    const chatbotData = chatbot[0]

    // Registrar a origem do embed para telemetria
    if (referrer) {
      try {
        await db.query(
          `
          INSERT INTO "ChatSession" ("id", "chatbotId", "source", "referrer", "startedAt")
          VALUES ($1, $2, $3, $4, NOW())
        `,
          [`embed-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, chatbotId, "embed", referrer],
        )
      } catch (error) {
        console.error("Erro ao registrar sessão de embed:", error)
      }
    }

    return (
      <div className={`h-screen w-full ${theme === "dark" ? "dark bg-slate-900" : "bg-white"}`}>
        <ChatPlayground chatbotId={chatbotId} chatbotName={chatbotData.name} chatbotImage={chatbotData.imageUrl} />
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar chatbot para embed:", error)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Erro ao carregar chatbot</h2>
          <p>Não foi possível carregar o chatbot. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }
}
