"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSubscription } from "@/hooks/use-subscription"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function SubscriptionStatus({ chatbotCount = 0 }: { chatbotCount?: number }) {
  const { subscription, loading, error } = useSubscription()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Loading subscription information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load subscription information. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  // Valores padrão para plano gratuito
  const freePlanLimits = {
    chatbotLimit: 1,
    messageLimit: 50,
  }

  // Calcular porcentagens de uso
  const chatbotPercentage = Math.min(
    100,
    (chatbotCount / (subscription?.chatbotLimit || freePlanLimits.chatbotLimit)) * 100,
  )

  // Estimar uso de mensagens para demonstração
  const estimatedMessageCount = 25 // Valor fictício para demonstração
  const messagePercentage = Math.min(
    100,
    (estimatedMessageCount / (subscription?.messageLimit || freePlanLimits.messageLimit)) * 100,
  )

  // Determinar se está próximo do limite
  const isNearChatbotLimit = chatbotPercentage >= 80
  const isNearMessageLimit = messagePercentage >= 80

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{subscription ? subscription.plan?.name || "Free Plan" : "Free Plan"}</CardTitle>
          <CardDescription>
            {subscription?.status === "active" ? "Active subscription" : "Limited features"}
          </CardDescription>
        </div>
        <Badge variant={subscription?.status === "active" ? "default" : "outline"}>
          {subscription?.status === "active" ? "Active" : "Free"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Chatbots</span>
              <span className="text-sm text-muted-foreground">
                {chatbotCount}/{subscription?.chatbotLimit || freePlanLimits.chatbotLimit}
              </span>
            </div>
            <Progress value={chatbotPercentage} className={`h-2 ${isNearChatbotLimit ? "bg-amber-200" : ""}`} />
            {isNearChatbotLimit && (
              <p className="text-xs text-amber-600 mt-1">
                You're approaching your chatbot limit. Consider upgrading your plan.
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Messages</span>
              <span className="text-sm text-muted-foreground">
                {estimatedMessageCount}/{subscription?.messageLimit || freePlanLimits.messageLimit}
              </span>
            </div>
            <Progress value={messagePercentage} className={`h-2 ${isNearMessageLimit ? "bg-amber-200" : ""}`} />
            {isNearMessageLimit && (
              <p className="text-xs text-amber-600 mt-1">
                You're approaching your monthly message limit. Consider upgrading your plan.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          {subscription?.status === "active"
            ? `Renews on ${new Date(subscription.currentPeriodEnd || Date.now()).toLocaleDateString()}`
            : "Free tier has limited features"}
        </p>
        <Link href="/dashboard/subscription">
          <Button variant="outline" size="sm">
            {subscription?.status === "active" ? "Manage" : "Upgrade"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default SubscriptionStatus
