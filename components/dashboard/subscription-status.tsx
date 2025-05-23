"use client"

import { useEffect, useState } from "react"
import { CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Plan {
  id: string
  name: string
  maxChatbots: number
  maxMessagesPerMonth: number
}

interface Subscription {
  id?: string
  status: string
  plan?: Plan
}

interface SubscriptionStatusProps {
  chatbotCount: number
}

export function SubscriptionStatus({ chatbotCount }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscriptions")
        if (response.ok) {
          const data = await response.json()
          setSubscription(data)
        }
      } catch (error) {
        console.error("Error fetching subscription:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const getPlanName = () => {
    if (loading) return "Carregando..."
    if (!subscription || subscription.status !== "active" || !subscription.plan) return "Nenhum plano ativo"
    return subscription.plan.name
  }

  const getMaxChatbots = () => {
    if (loading) return "?"
    if (!subscription || subscription.status !== "active" || !subscription.plan) return "0"
    return subscription.plan.maxChatbots
  }

  const getMaxMessages = () => {
    if (loading) return "Carregando..."
    if (!subscription || subscription.status !== "active" || !subscription.plan) return "0"
    return subscription.plan.maxMessagesPerMonth.toLocaleString()
  }

  const getBadgeVariant = () => {
    if (loading) return "outline"
    if (!subscription || subscription.status !== "active") return "secondary"
    return "default"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Seu Plano</CardTitle>
          <CardDescription>Informações sobre sua assinatura atual</CardDescription>
        </div>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Plano atual:</span>
            <Badge variant={getBadgeVariant()}>{getPlanName()}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Chatbots:</span>
            <span>
              {chatbotCount} / {getMaxChatbots()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Mensagens por mês:</span>
            <span>{getMaxMessages()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/subscription" className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            Gerenciar Assinatura
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
