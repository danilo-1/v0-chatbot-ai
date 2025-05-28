"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface ChatPlaygroundProps {
  chatbotId: string
  chatbotName: string
  chatbotImageUrl?: string
}

export function ChatPlayground({ chatbotId, chatbotName, chatbotImageUrl }: ChatPlaygroundProps) {
  const [limitExceeded, setLimitExceeded] = useState(false)
  const [limits, setLimits] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: `/api/chatbots/${chatbotId}/chat`,
    onError: (error) => {
      // Verificar se o erro é de limite excedido
      if (error.message.includes("402") || error.message.includes("Limite")) {
        setLimitExceeded(true)
        try {
          const errorData = JSON.parse(error.message.split("data: ")[1])
          if (errorData && errorData.limits) {
            setLimits(errorData.limits)
          }
        } catch (e) {
          console.error("Erro ao processar dados de limite:", e)
        }
      }
    },
  })

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="flex flex-col h-[600px] w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            {chatbotImageUrl ? (
              <AvatarImage src={chatbotImageUrl || "/placeholder.svg"} alt={chatbotName} />
            ) : (
              <AvatarFallback>{getInitials(chatbotName)}</AvatarFallback>
            )}
          </Avatar>
          {chatbotName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
              <p>Envie uma mensagem para começar a conversar com {chatbotName}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
          {error && !limitExceeded && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.
              </AlertDescription>
            </Alert>
          )}
          {limitExceeded && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Limite de mensagens excedido</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>
                  Você atingiu o limite de {limits?.messageLimit || "mensagens"} do seu plano atual. Para continuar
                  conversando, faça upgrade para um plano com mais mensagens.
                </p>
                <Button onClick={() => router.push("/dashboard/subscription")}>Ver planos disponíveis</Button>
              </AlertDescription>
            </Alert>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading || limitExceeded}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input || limitExceeded}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
