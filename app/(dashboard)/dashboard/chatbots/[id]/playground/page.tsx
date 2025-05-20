import { ChatPlayground } from "@/components/chat/chat-playground"
import type { Chatbot } from "@/lib/types"
import { getChatbot } from "@/lib/utils"

interface Props {
  params: {
    id: string
  }
}

const ChatbotPlaygroundPage = async ({ params }: Props) => {
  const chatbot = (await getChatbot(params.id)) as Chatbot

  if (!chatbot) {
    return <div>Chatbot not found</div>
  }

  return (
    <ChatPlayground chatbotId={chatbot.id} chatbotName={chatbot.name} chatbotImageUrl={chatbot.imageUrl || undefined} />
  )
}

export default ChatbotPlaygroundPage
