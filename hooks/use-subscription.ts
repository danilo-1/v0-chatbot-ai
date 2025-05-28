"use client"

import { useState, useEffect } from "react"

interface Plan {
  id: string
  name: string
  price: number
  messageLimit: number
  chatbotLimit: number
}

interface Subscription {
  id: string
  status: string
  planId: string
  plan: Plan
  currentPeriodEnd: string
  chatbotLimit: number
  messageLimit: number
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setLoading(true)
        const response = await fetch("/api/subscriptions/current")

        if (!response.ok) {
          if (response.status === 404) {
            // Não tem assinatura, não é um erro
            setSubscription(null)
            return
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setSubscription(data.subscription)
      } catch (err) {
        console.error("Error fetching subscription:", err)
        setError(err instanceof Error ? err.message : "Failed to load subscription")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  return {
    subscription,
    loading,
    error,
    isWithinChatbotLimit: (count: number) => {
      if (!subscription) return count < 1 // Limite padrão para plano gratuito
      return count < (subscription.chatbotLimit || 1)
    },
    isWithinMessageLimit: (count: number) => {
      if (!subscription) return count < 50 // Limite padrão para plano gratuito
      return count < (subscription.messageLimit || 50)
    },
    chatbotLimit: subscription?.chatbotLimit || 1, // Limite padrão
    messageLimit: subscription?.messageLimit || 50, // Limite padrão
  }
}
