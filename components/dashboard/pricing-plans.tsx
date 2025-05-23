"use client"

import { useState, useEffect } from "react"
import { Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: string
  maxChatbots: number
  maxMessagesPerMonth: number
  features: string[]
}

interface Subscription {
  id?: string
  status: string
  currentPeriodEnd?: Date
  plan?: Plan
}

export function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans")
        if (!response.ok) throw new Error("Falha ao carregar planos")
        const data = await response.json()
        setPlans(data)
      } catch (err) {
        setError("Não foi possível carregar os planos. Tente novamente mais tarde.")
        console.error(err)
      }
    }

    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscriptions")
        if (!response.ok) throw new Error("Falha ao carregar assinatura")
        const data = await response.json()
        setSubscription(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
    fetchSubscription()
  }, [])

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribing(true)
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao assinar plano")
      }

      const data = await response.json()
      setSubscription(data)
      toast({
        title: "Assinatura realizada com sucesso!",
        description: `Você agora está inscrito no plano ${data.plan.name}.`,
      })
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Erro ao assinar plano",
        description: err instanceof Error ? err.message : "Ocorreu um erro ao processar sua assinatura.",
      })
    } finally {
      setSubscribing(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setSubscribing(true)
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao cancelar assinatura")
      }

      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura será cancelada ao final do período atual.",
      })

      // Atualizar o estado local para refletir o cancelamento
      if (subscription) {
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: true,
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Erro ao cancelar assinatura",
        description: err instanceof Error ? err.message : "Ocorreu um erro ao cancelar sua assinatura.",
      })
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const formatCurrency = (value: number, currency = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(value)
  }

  const isCurrentPlan = (planId: string) => {
    return subscription?.plan?.id === planId && subscription.status === "active"
  }

  return (
    <div className="space-y-8">
      {subscription && subscription.status === "active" && subscription.plan && (
        <Alert className="bg-primary/10 border-primary">
          <AlertTitle className="text-primary">Plano atual: {subscription.plan.name}</AlertTitle>
          <AlertDescription>
            Sua assinatura está ativa até {new Date(subscription.currentPeriodEnd!).toLocaleDateString("pt-BR")}. Você
            tem acesso a {subscription.plan.maxChatbots} chatbots e{" "}
            {subscription.plan.maxMessagesPerMonth.toLocaleString()} mensagens por mês.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${isCurrentPlan(plan.id) ? "border-primary ring-1 ring-primary" : ""}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </div>
                {isCurrentPlan(plan.id) && (
                  <Badge variant="outline" className="bg-primary text-primary-foreground">
                    Atual
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                <span className="text-muted-foreground ml-1">/{plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isCurrentPlan(plan.id) ? (
                <Button variant="outline" className="w-full" onClick={handleCancelSubscription} disabled={subscribing}>
                  Cancelar assinatura
                </Button>
              ) : (
                <Button className="w-full" onClick={() => handleSubscribe(plan.id)} disabled={subscribing}>
                  {subscribing ? "Processando..." : "Assinar plano"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
