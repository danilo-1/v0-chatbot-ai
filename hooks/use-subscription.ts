"use client"

import { useState, useEffect } from "react"

interface Plan {
  id: string
  name: string
  maxChatbots: number
  maxMessagesPerMonth: number
}

interface Subscription {
  id?: string
  status: string
  plan?: Plan
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscriptions")
        if (!response.ok) throw new Error("Falha ao carregar assinatura")
        const data = await response.json()
        setSubscription(data)
      } catch (err) {
        console.error(err)
        setError("Falha ao carregar informações da assinatura")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const canCreateChatbot = (currentCount: number): boolean => {
    if (!subscription || subscription.status !== "active" || !subscription.plan) {
      return false // Sem assinatura ativa, não pode criar
    }

    return currentCount < subscription.plan.maxChatbots
  }

  const getRemainingMessages = (): number => {
    if (!subscription || subscription.status !== "active" || !subscription.plan) {
      return 0
    }

    // Aqui você poderia implementar a lógica para verificar quantas mensagens já foram usadas no mês
    // Por simplicidade, estamos retornando o máximo permitido
    return subscription.plan.maxMessagesPerMonth
  }

  const getCurrentPlan = (): Plan | null => {
    if (!subscription || subscription.status !== "active" || !subscription.plan) {
      return null
    }

    return subscription.plan
  }

  return {
    subscription,
    loading,
    error,
    canCreateChatbot,
    getRemainingMessages,
    getCurrentPlan,
  }
}
