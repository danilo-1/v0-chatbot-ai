"use client"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"

interface ChatPlaygroundProps {
  chatbotId: string
  chatbotName: string
  chatbotImageUrl?: string // Adicionar campo para a URL da imagem
}

export function ChatPlayground({ chatbotId, chatbotName, chatbotImageUrl }: ChatPlaygroundProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: `/api/chat/${chatbotId}`,
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {chatbotImageUrl ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src={chatbotImageUrl || "/placeholder.svg"} alt={chatbotName} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-medium text-primary">{chatbotName.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span className="font-medium">{chatbotName}</span>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 space-y-4 p-4">
        {messages.length === 0 && (
          <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center rounded-lg bg-secondary p-4 text-center">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{chatbotName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="mt-4 text-sm text-muted-foreground">Start a conversation with {chatbotName}!</p>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className="grid w-full max-w-2xl items-start gap-2">
            {message.role === "user" && (
              <>
                <div className="col-start-1 row-start-1 flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {/* You can replace this with the user's avatar */}
                      You
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">You</p>
                </div>
                <div className="col-start-2 row-start-1 rounded-lg bg-primary/10 p-3 text-sm">{message.content}</div>
              </>
            )}
            {message.role === "assistant" && (
              <div className="flex items-start gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
                  {chatbotImageUrl ? (
                    <Image
                      src={chatbotImageUrl || "/placeholder.svg"}
                      alt={chatbotName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-sm font-medium text-primary">{chatbotName.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 overflow-hidden rounded-lg bg-muted p-3">
                  <ReactMarkdown className="prose prose-sm dark:prose-invert" remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
      <Separator />
      <div className="container py-4">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <Input
            type="text"
            value={input}
            placeholder="Ask me anything..."
            onChange={handleInputChange}
            className="pr-12"
          />
          <Button type="submit" disabled={isLoading} className="absolute right-1.5">
            {isLoading ? null : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
