"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ChatPlaygroundProps {
  chatbotId: string
  initialMessages?: Message[]
  chatbotName?: string
  chatbotImageUrl?: string
}

export function ChatPlayground({
  chatbotId,
  initialMessages = [],
  chatbotName = "Chatbot",
  chatbotImageUrl,
}: ChatPlaygroundProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-3 p-4 border-b">
        <Avatar className="h-10 w-10">
          {chatbotImageUrl ? (
            <AvatarImage src={chatbotImageUrl || "/placeholder.svg"} alt={chatbotName} />
          ) : (
            <AvatarFallback>{chatbotName.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{chatbotName}</h2>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h3 className="text-xl font-semibold mb-2">Welcome to {chatbotName}</h3>
              <p className="text-muted-foreground mb-4">Start a conversation by sending a message below.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="h-8 w-8">
                      {message.role === "assistant" ? (
                        chatbotImageUrl ? (
                          <AvatarImage src={chatbotImageUrl || "/placeholder.svg"} alt={chatbotName} />
                        ) : (
                          <AvatarFallback>{chatbotName.charAt(0)}</AvatarFallback>
                        )
                      ) : (
                        <AvatarFallback>U</AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      {chatbotImageUrl ? (
                        <AvatarImage src={chatbotImageUrl || "/placeholder.svg"} alt={chatbotName} />
                      ) : (
                        <AvatarFallback>{chatbotName.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <Skeleton className="h-12 w-40 rounded-lg" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

// Adicionar exportação padrão para resolver o erro
export default ChatPlayground
