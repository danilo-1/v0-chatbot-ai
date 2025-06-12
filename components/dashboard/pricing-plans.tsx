"use client"

import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Plan {
  name: string
  price: number
  currency: string
  isFree?: boolean
  features: string[]
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: 0,
    currency: "BRL",
    isFree: true,
    features: ["1 chatbot", "50 mensagens por mês", "Conhecimento base limitado", "Suporte por email"],
  },
  {
    name: "Básico",
    price: 29.9,
    currency: "BRL",
    features: [
      "3 chatbots",
      "1.000 mensagens por mês",
      "Conhecimento base ilimitado",
      "Suporte prioritário",
      "Personalização de aparência",
    ],
  },
  {
    name: "Profissional",
    price: 79.9,
    currency: "BRL",
    features: [
      "10 chatbots",
      "5.000 mensagens por mês",
      "Conhecimento base ilimitado",
      "Suporte prioritário 24/7",
      "Personalização completa",
      "Análise avançada de conversas",
      "Integração com CRM",
    ],
  },
  {
    name: "Empresarial",
    price: 199.9,
    currency: "BRL",
    features: [
      "50 chatbots",
      "20.000 mensagens por mês",
      "Conhecimento base ilimitado",
      "Suporte dedicado 24/7",
      "Personalização completa",
      "Análise avançada de conversas",
      "Integração com CRM",
      "API dedicada",
      "SLA garantido",
    ],
  },
]

export function PricingPlans() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((plan) => (
        <Card key={plan.name} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>
              {plan.isFree ? "Gratuito" : `R$${plan.price}/mês`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm flex-1">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full" variant={plan.isFree ? "outline" : "default"}>
              {plan.isFree ? "Começar" : "Assinar"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default PricingPlans
