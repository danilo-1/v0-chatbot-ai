import { ChatPlayground } from "@/components/chat/chat-playground"
import type { Chatbot } from "@/lib/types"

interface Props {
  params: { id: string }
}

async function getChatbot(id: string): Promise<Chatbot | null> {
  // TODO: Replace with actual data fetching logic
  // This is a placeholder implementation
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  if (id === "1") {
    return {
      id: "1",
      name: "Example Chatbot",
      description: "A simple example chatbot.",
      createdAt: new Date(),
      userId: "user123",
      modelName: "gpt-3.5-turbo",
      imageUrl: "/example-chatbot.png",
    }
  }

  return null
}

export default async function ChatbotPage({ params }: Props) {
  const { id } = params
  const chatbot = await getChatbot(id)

  if (!chatbot) {
    return <div>Chatbot not found.</div>
  }

  return (
    <div>
      <h1>{chatbot.name}</h1>
      <p>{chatbot.description}</p>
      <ChatPlayground
        chatbotId={chatbot.id}
        chatbotName={chatbot.name}
        chatbotImageUrl={chatbot.imageUrl || undefined}
      />
    </div>
  )
}
