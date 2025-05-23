"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  messageLimit: number
  chatbotLimit: number
  features: string[]
}

interface Subscription {
  id: string
  status: string
  planId: string
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscribing, setSubscribing] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const [plansResponse, subscriptionResponse] = await Promise.all([
          fetch("/api/plans"),
          fetch("/api/subscriptions/current"),
        ])

        if (!plansResponse.ok) {
          throw new Error("Failed to fetch plans")
        }

        const plansData = await plansResponse.json()
        setPlans(plansData.plans)

        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json()
          setCurrentSubscription(subscriptionData.subscription)
        }
      } catch (err) {
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        throw new Error("Failed to subscribe")
      }

      const data = await response.json()
      setCurrentSubscription(data.subscription)

      toast({
        title: "Assinatura realizada com sucesso!",
        description: "Seu plano foi atualizado.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao assinar plano",
        description: "Não foi possível processar sua assinatura. Tente novamente.",
      })
      console.error(err)
    } finally {
      setSubscribing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return

    try {
      setCancelling(true)
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId: currentSubscription.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel subscription")
      }

      setCurrentSubscription(null)

      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao cancelar assinatura",
        description: "Não foi possível cancelar sua assinatura. Tente novamente.",
      })
      console.error(err)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-40">
          <p>Carregando planos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Planos e Assinaturas</h1>
        <p className="text-muted-foreground">Escolha o plano ideal para suas necessidades</p>
      </div>

      {currentSubscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assinatura Atual</CardTitle>
            <CardDescription>Você já possui uma assinatura ativa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p>
                  Plano: <strong>{plans.find((p) => p.id === currentSubscription.planId)?.name}</strong>
                </p>
                <p>
                  Status: <strong>{currentSubscription.status === "active" ? "Ativo" : "Inativo"}</strong>
                </p>
              </div>
              <Button variant="destructive" onClick={handleCancelSubscription} disabled={cancelling}>
                {cancelling ? "Cancelando..." : "Cancelar Assinatura"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="monthly">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="annual" disabled>
            Anual (em breve)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan = currentSubscription?.planId === plan.id
              const formattedPrice = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(plan.price / 100)

              return (
                <Card key={plan.id} className={isCurrentPlan ? "border-primary" : ""}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{formattedPrice}</span>
                      <span className="text-muted-foreground"> /mês</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center">
                        <span className="mr-2">✓</span>
                        <span>{plan.chatbotLimit} chatbots</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">✓</span>
                        <span>{plan.messageLimit.toLocaleString()} mensagens/mês</span>
                      </li>
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribing || isCurrentPlan}
                    >
                      {isCurrentPlan ? "Plano Atual" : subscribing ? "Processando..." : "Assinar"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
