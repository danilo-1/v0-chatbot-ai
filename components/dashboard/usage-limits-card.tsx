"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface UsageLimits {
  isWithinLimits: boolean
  isWithinMessageLimit: boolean
  isWithinChatbotLimit: boolean
  messageCount: number
  chatbotCount: number
  messageLimit: number
  chatbotLimit: number
  percentageUsed: number
}

export function UsageLimitsCard() {
  const [limits, setLimits] = useState<UsageLimits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchLimits() {
      try {
        const response = await fetch("/api/user/limits")
        if (!response.ok) {
          throw new Error("Falha ao carregar limites de uso")
        }
        const data = await response.json()
        setLimits(data)
      } catch (err) {
        setError("Não foi possível carregar seus limites de uso")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLimits()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uso e Limites</CardTitle>
          <CardDescription>Carregando informações de uso...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !limits) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uso e Limites</CardTitle>
          <CardDescription>Informações sobre seu plano atual</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error || "Não foi possível carregar seus limites de uso"}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const messagePercentage = Math.min(Math.round((limits.messageCount / limits.messageLimit) * 100), 100)
  const chatbotPercentage = Math.min(Math.round((limits.chatbotCount / limits.chatbotLimit) * 100), 100)
  const needsUpgrade = !limits.isWithinMessageLimit || !limits.isWithinChatbotLimit || messagePercentage > 80

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso e Limites</CardTitle>
        <CardDescription>Informações sobre seu plano atual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {needsUpgrade && (
          <Alert variant={messagePercentage > 90 ? "destructive" : "warning"} className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {!limits.isWithinMessageLimit
                ? "Limite de mensagens excedido"
                : messagePercentage > 90
                  ? "Limite quase atingido"
                  : "Considere fazer upgrade"}
            </AlertTitle>
            <AlertDescription>
              {!limits.isWithinMessageLimit
                ? "Você atingiu seu limite mensal de mensagens. Faça upgrade para continuar usando o chatbot."
                : messagePercentage > 90
                  ? "Você está prestes a atingir seu limite mensal de mensagens."
                  : "Você já utilizou mais de 80% do seu limite mensal de mensagens."}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Mensagens utilizadas</span>
            <span className="font-medium">
              {limits.messageCount} / {limits.messageLimit}
            </span>
          </div>
          <Progress value={messagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {messagePercentage}% do limite mensal utilizado
            {messagePercentage > 80 && !limits.isWithinMessageLimit && " - Limite excedido"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Chatbots criados</span>
            <span className="font-medium">
              {limits.chatbotCount} / {limits.chatbotLimit}
            </span>
          </div>
          <Progress value={chatbotPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {chatbotPercentage}% do limite de chatbots utilizado
            {!limits.isWithinChatbotLimit && " - Limite excedido"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push("/dashboard/subscription")}
          className="w-full"
          variant={needsUpgrade ? "default" : "outline"}
        >
          {needsUpgrade ? "Fazer upgrade agora" : "Ver planos disponíveis"}
        </Button>
      </CardFooter>
    </Card>
  )
}
