import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PricingPlans } from "@/components/dashboard/pricing-plans"

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Planos e Assinaturas</h1>
      <p className="text-muted-foreground mb-6">
        Escolha o plano ideal para suas necessidades e aproveite todos os recursos da plataforma.
      </p>

      <PricingPlans />
    </div>
  )
}
