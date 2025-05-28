import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Este componente é renderizado no servidor
export default function SubscriptionStatusWrapper({ chatbotCount }: { chatbotCount: number }) {
  return <SubscriptionStatusClient chatbotCount={chatbotCount} />
}
// Este componente é renderizado no cliente
;("use client")
import { useEffect, useState } from "react"
import SubscriptionStatus from "./subscription-status"

function SubscriptionStatusClient({ chatbotCount }: { chatbotCount: number }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
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

  return <SubscriptionStatus chatbotCount={chatbotCount} />
}
