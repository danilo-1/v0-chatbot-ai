import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ChatbotInsights } from "@/components/dashboard/chatbot-insights"

export const dynamic = "force-dynamic"

export default async function ChatbotInsightsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch chatbot
  const chatbotResult = await sql`
    SELECT * FROM "Chatbot"
    WHERE id = ${params.id}
  `

  if (chatbotResult.length === 0) {
    notFound()
  }

  const chatbot = chatbotResult[0]

  // Check if user owns the chatbot
  if (chatbot.userId !== session.user.id && session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{chatbot.name} Insights</h1>
        <p className="text-muted-foreground">View usage statistics and insights for your chatbot.</p>
      </div>

      <ChatbotInsights chatbotId={params.id} />
    </div>
  )
}
