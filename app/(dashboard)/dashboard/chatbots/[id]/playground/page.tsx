import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { getChatbotById } from "@/backend/chatbot"
import { ChatPlayground } from "@/components/chat-playground"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"
import Link from "next/link"
import { ChatbotSettings } from "@/components/chatbot-settings"

interface PlaygroundPageProps {
  params: {
    id: string
  }
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const session = await getServerSession()
  const chatbot = await getChatbotById(params.id)

  if (!chatbot) {
    redirect("/dashboard/chatbots")
  }

  // Check if user owns this chatbot
  if (chatbot.userId !== session?.user?.id) {
    // If not the owner, check if it's public
    if (!chatbot.isPublic) {
      redirect("/dashboard/chatbots")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{chatbot.name}</h1>
        {chatbot.userId === session?.user?.id && (
          <Link href={`/dashboard/chatbots/${chatbot.id}/edit`}>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Edit Chatbot
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          {chatbot.userId === session?.user?.id && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>
        <TabsContent value="chat" className="mt-6">
          <ChatPlayground
            chatbotId={chatbot.id}
            chatbotName={chatbot.name}
            chatbotImage={chatbot.imageUrl || undefined}
          />
        </TabsContent>
        {chatbot.userId === session?.user?.id && (
          <TabsContent value="settings" className="mt-6">
            <ChatbotSettings chatbot={chatbot} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
