"use client"

import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSubscription } from "@/hooks/use-subscription"

export const SubscriptionStatus = () => {
  const { subscription, isLoading, error } = useSubscription()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Loading subscription information...</CardDescription>
        </CardHeader>
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

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Plan</CardTitle>
          <CardDescription>You are currently on the free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Messages</span>
                <span className="text-sm text-muted-foreground">25/50</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Chatbots</span>
                <span className="text-sm text-muted-foreground">1/1</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Upgrade to a paid plan for more features and higher limits.</p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{subscription.plan.name}</CardTitle>
          <CardDescription>
            {subscription.status === "active" ? "Active subscription" : "Subscription " + subscription.status}
          </CardDescription>
        </div>
        <Badge variant={subscription.status === "active" ? "default" : "outline"}>
          {subscription.status === "active" ? "Active" : subscription.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Messages</span>
              <span className="text-sm text-muted-foreground">
                {subscription.usage?.messages || 0}/{subscription.plan.limits.messages}
              </span>
            </div>
            <Progress
              value={((subscription.usage?.messages || 0) / subscription.plan.limits.messages) * 100}
              className="h-2"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Chatbots</span>
              <span className="text-sm text-muted-foreground">
                {subscription.usage?.chatbots || 0}/{subscription.plan.limits.chatbots}
              </span>
            </div>
            <Progress
              value={((subscription.usage?.chatbots || 0) / subscription.plan.limits.chatbots) * 100}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {subscription.renewalDate && `Renews on ${new Date(subscription.renewalDate).toLocaleDateString()}`}
        </p>
      </CardFooter>
    </Card>
  )
}

export default SubscriptionStatus
