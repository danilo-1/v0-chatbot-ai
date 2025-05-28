"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSubscription } from "@/hooks/use-subscription"

export function ChatLimitWarning() {
  const { subscription, loading } = useSubscription()

  if (loading || !subscription) return null

  // Se o usuário tiver um plano pago, não mostrar aviso
  if (subscription.status === "active" && !subscription.plan?.isFree) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Free Plan Limitations</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          You're using the free plan which is limited to {subscription.messageLimit || 50} messages per month. Upgrade
          to a paid plan for unlimited messages and more features.
        </p>
        <Button variant="outline" size="sm" className="w-fit mt-2" asChild>
          <Link href="/dashboard/subscription">View Plans</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
