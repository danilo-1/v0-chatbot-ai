import type { Metadata } from "next"
import { PricingPlans } from "@/components/dashboard/pricing-plans"

export const metadata: Metadata = {
  title: "Assinatura | ChatbotAI",
  description: "Gerencie sua assinatura e escolha o plano ideal para suas necessidades",
}

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assinatura</h1>
        <p className="text-muted-foreground mt-2">
          Escolha o plano ideal para suas necessidades e gerencie sua assinatura.
        </p>
      </div>

      <div className="space-y-8">
        <PricingPlans />
      </div>
    </div>
  )
}
