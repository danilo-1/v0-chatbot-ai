"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export function WelcomeMessage() {
  const { language } = useLanguage()
  const [country, setCountry] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCountry() {
      try {
        const response = await fetch("/api/detect-language")
        const data = await response.json()
        setCountry(data.country)
      } catch (error) {
        console.error("Failed to fetch country:", error)
      }
    }

    fetchCountry()
  }, [])

  const welcomeMessages: Record<string, Record<string, string>> = {
    "pt-BR": {
      BR: "Bem-vindo ao ChatbotAI! Detectamos que você está no Brasil.",
      default: "Bem-vindo ao ChatbotAI!",
    },
    "en-US": {
      US: "Welcome to ChatbotAI! We detected you're in the United States.",
      GB: "Welcome to ChatbotAI! We detected you're in the United Kingdom.",
      default: "Welcome to ChatbotAI!",
    },
    "es-ES": {
      ES: "¡Bienvenido a ChatbotAI! Detectamos que estás en España.",
      MX: "¡Bienvenido a ChatbotAI! Detectamos que estás en México.",
      default: "¡Bienvenido a ChatbotAI!",
    },
    "fr-FR": {
      FR: "Bienvenue sur ChatbotAI ! Nous avons détecté que vous êtes en France.",
      default: "Bienvenue sur ChatbotAI !",
    },
    "de-DE": {
      DE: "Willkommen bei ChatbotAI! Wir haben festgestellt, dass Sie sich in Deutschland befinden.",
      default: "Willkommen bei ChatbotAI!",
    },
  }

  const message = country
    ? welcomeMessages[language.code]?.[country] || welcomeMessages[language.code]?.default
    : welcomeMessages[language.code]?.default

  return (
    <div className="bg-primary/10 p-4 rounded-lg mb-6">
      <p className="text-sm">{message}</p>
    </div>
  )
}
