"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Subscription {
  id: string
  status: string
  planId: string
  plan: {
    name: string
    price: number
    messageLimit: number
    chatbotLimit: number
  }
  startDate: string
  endDate: string | null
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/subscriptions/current")
        if (!response.ok) {
          throw new Error("Failed to fetch subscription")
        }
        const data = await response.json()
        setSubscription(data.subscription)
      } catch (err) {
        setError("Não foi possível carregar os dados da assinatura")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>Carregando informações da assinatura...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assinatura</CardTitle>
          <CardDescription>Você não possui uma assinatura ativa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <p className="text-center text-muted-foreground">
              Assine um plano para acessar recursos adicionais e aumentar seus limites
            </p>
            <Button asChild>
              <Link href="/dashboard/subscription">Ver planos disponíveis</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isActive = subscription.status === "active"
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(subscription.plan.price / 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assinatura</CardTitle>
            <CardDescription>Detalhes do seu plano atual</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "destructive"}>{isActive ? "Ativo" : "Inativo"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Plano</h3>
            <p className="text-2xl font-bold">{subscription.plan.name}</p>
            <p className="text-muted-foreground">{formattedPrice}/mês</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Limite de chatbots</h4>
              <p>{subscription.plan.chatbotLimit}</p>
            </div>
            <div>
              <h4 className="font-medium">Limite de mensagens</h4>
              <p>{subscription.plan.messageLimit.toLocaleString()} / mês</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/subscription">Gerenciar assinatura</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
