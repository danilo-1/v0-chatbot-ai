import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { sql } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Buscar planos disponíveis
  const plans = await sql`
    SELECT * FROM "Plan" 
    ORDER BY price ASC
  `

  // Buscar assinatura atual do usuário
  const subscription = await sql`
    SELECT s.*, p.* 
    FROM "Subscription" s
    JOIN "Plan" p ON s."planId" = p.id
    WHERE s."userId" = ${session.user.id}
    AND s.status = 'active'
    LIMIT 1
  `

  const currentPlan = subscription[0]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>

      {currentPlan && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Current Plan: {currentPlan.name}</CardTitle>
            <CardDescription>
              Your subscription is active until {new Date(currentPlan.currentPeriodEnd).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>
                <strong>{currentPlan.chatbotLimit}</strong> chatbots included
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>
                <strong>{currentPlan.messageLimit.toLocaleString()}</strong> messages per month
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/dashboard/subscription/manage">Manage Subscription</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={currentPlan && currentPlan.id === plan.id ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.isFree ? "Free forever" : `$${plan.price}/month`}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{plan.chatbotLimit}</strong> chatbots
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{plan.messageLimit.toLocaleString()}</strong> messages per month
                  </span>
                </li>
                {plan.features &&
                  plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
            <CardFooter>
              {currentPlan && currentPlan.id === plan.id ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button variant={plan.isFree ? "outline" : "default"} className="w-full" asChild>
                  <Link href={`/dashboard/subscription/checkout?plan=${plan.id}`}>
                    {plan.isFree ? "Downgrade" : "Upgrade"}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-10 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Need a custom plan?</h2>
        <p className="mb-4">
          If you need more chatbots, messages, or custom features, we offer tailored enterprise plans. Contact our sales
          team to discuss your requirements.
        </p>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  )
}
