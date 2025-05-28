"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/hooks/use-subscription"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function UsageLimitsCard() {
  const { subscription, loading, error } = useSubscription()
  const [usage, setUsage] = useState({
    messages: 0,
    chatbots: 0,
  })
  const [loadingUsage, setLoadingUsage] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch("/api/user/usage")
        if (response.ok) {
          const data = await response.json()
          setUsage(data.usage)
        }
      } catch (err) {
        console.error("Error fetching usage:", err)
      } finally {
        setLoadingUsage(false)
      }
    }

    fetchUsage()
  }, [])

  if (loading || loadingUsage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
          <CardDescription>Loading your usage data...</CardDescription>
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
        <AlertDescription>Failed to load usage information. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  // Valores padrão para plano gratuito
  const messageLimit = subscription?.messageLimit || 50
  const chatbotLimit = subscription?.chatbotLimit || 1

  // Calcular porcentagens
  const messagePercentage = Math.min(100, (usage.messages / messageLimit) * 100)
  const chatbotPercentage = Math.min(100, (usage.chatbots / chatbotLimit) * 100)

  // Determinar se está próximo do limite
  const isNearMessageLimit = messagePercentage >= 80
  const isNearChatbotLimit = chatbotPercentage >= 80
  const isLimitExceeded = messagePercentage >= 100 || chatbotPercentage >= 100

  return (
    <Card className={isLimitExceeded ? "border-destructive" : ""}>
      <CardHeader>
        <CardTitle>Usage Limits</CardTitle>
        <CardDescription>
          {subscription ? `Your ${subscription.plan?.name} plan limits` : "Free tier limits"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Messages</span>
            <span className="text-sm text-muted-foreground">
              {usage.messages}/{messageLimit}
            </span>
          </div>
          <Progress
            value={messagePercentage}
            className={`h-2 ${isNearMessageLimit ? "bg-amber-200" : ""} ${messagePercentage >= 100 ? "bg-destructive" : ""}`}
          />
          {isNearMessageLimit && messagePercentage < 100 && (
            <p className="text-xs text-amber-600 mt-1">You're approaching your monthly message limit.</p>
          )}
          {messagePercentage >= 100 && (
            <p className="text-xs text-destructive mt-1">You've reached your monthly message limit.</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Chatbots</span>
            <span className="text-sm text-muted-foreground">
              {usage.chatbots}/{chatbotLimit}
            </span>
          </div>
          <Progress
            value={chatbotPercentage}
            className={`h-2 ${isNearChatbotLimit ? "bg-amber-200" : ""} ${chatbotPercentage >= 100 ? "bg-destructive" : ""}`}
          />
          {isNearChatbotLimit && chatbotPercentage < 100 && (
            <p className="text-xs text-amber-600 mt-1">You're approaching your chatbot limit.</p>
          )}
          {chatbotPercentage >= 100 && (
            <p className="text-xs text-destructive mt-1">You've reached your chatbot limit.</p>
          )}
        </div>

        {isLimitExceeded && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've exceeded your plan limits. Upgrade to continue using all features.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button variant={isLimitExceeded ? "default" : "outline"} className="w-full" asChild>
          <Link href="/dashboard/subscription">{isLimitExceeded ? "Upgrade Now" : "View Plans"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
