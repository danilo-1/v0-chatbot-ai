"use client"

import { useState, useEffect } from "react"

export interface Plan {
  id: string
  name: string
  price: number
  limits: {
    messages: number
    chatbots: number
  }
}

export interface Subscription {
  id: string
  status: "active" | "canceled" | "past_due" | "trialing"
  plan: Plan
  renewalDate?: string
  usage?: {
    messages: number
    chatbots: number
  }
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/subscriptions/current")

        if (!response.ok) {
          throw new Error("Failed to fetch subscription")
        }

        const data = await response.json()
        setSubscription(data.subscription)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  return { subscription, isLoading, error }
}
