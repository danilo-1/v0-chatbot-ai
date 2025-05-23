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
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/subscriptions/current")
        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
        } else {
          // Se não houver assinatura, não é um erro
          setSubscription(null)
        }
      } catch (err) {
        setError("Erro ao carregar dados da assinatura")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const isWithinChatbotLimit = async (): Promise<boolean> => {
    if (!subscription) return true // Sem assinatura, usar limites padrão

    try {
      const response = await fetch("/api/chatbots/count")
      if (!response.ok) {
        throw new Error("Failed to fetch chatbot count")
      }

      const data = await response.json()
      return data.count < subscription.plan.chatbotLimit
    } catch (error) {
      console.error("Error checking chatbot limit:", error)
      return false
    }
  }

  return {
    subscription,
    loading,
    error,
    isWithinChatbotLimit,
    chatbotLimit: subscription?.plan.chatbotLimit || 2, // Limite padrão
    messageLimit: subscription?.plan.messageLimit || 1000, // Limite padrão
  }
}
