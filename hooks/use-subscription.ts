"use client"

import { useState, useEffect } from "react"

interface Subscription {
  id: string
  status: string
  plan?: {
    id: string
    name: string
  }
  chatbotLimit?: number
  messageLimit?: number
  currentPeriodEnd?: string
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/subscriptions/current")
        if (!response.ok) {
          throw new Error("Failed to fetch subscription")
        }

        const data = await response.json()
        setSubscription(data.subscription)
      } catch (err) {
        console.error("Error fetching subscription:", err)
        setError("Failed to load subscription information")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  return { subscription, loading, error }
}
