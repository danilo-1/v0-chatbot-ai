"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CreditCard } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan")

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    async function fetchPlan() {
      if (!planId) {
        router.push("/dashboard/subscription")
        return
      }

      try {
        const response = await fetch(`/api/plans/${planId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch plan details")
        }

        const data = await response.json()
        setPlan(data.plan)
      } catch (err) {
        setError(err.message || "Failed to load plan details")
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [planId, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessingPayment(true)

    // Simulação de processamento de pagamento
    setTimeout(() => {
      // Redirecionar para página de sucesso
      router.push("/dashboard/subscription/success")
    }, 2000)
  }

  if (loading) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load your plan details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading plan details...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/subscription")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
          </Button>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Plan not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/subscription")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/dashboard/subscription")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Checkout - {plan.name} Plan</CardTitle>
          <CardDescription>{plan.isFree ? "Free forever" : `$${plan.price}/month`}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" required />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={processingPayment}>
                {processingPayment ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span> Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Pay ${plan.price}/month
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            Your subscription will renew automatically each month. You can cancel anytime.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
