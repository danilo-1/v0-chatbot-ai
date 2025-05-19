import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { getChatbotById } from "@/backend/chatbot"
import { ChatbotSettings } from "@/components/chatbot-settings"

interface EditChatbotPageProps {
  params: {
    id: string
  }
}

export default async function EditChatbotPage({ params }: EditChatbotPageProps) {
  const session = await getServerSession()
  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    redirect("/dashboard/chatbots")
  }

  // Check if user owns this chatbot
  if (chatbot.userId !== session?.user?.id) {
    redirect("/dashboard/chatbots")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Chatbot</h1>
        <p className="text-muted-foreground">Update your chatbot's settings and knowledge base.</p>
      </div>

      <ChatbotSettings chatbot={chatbot} />
    </div>
  )
}
