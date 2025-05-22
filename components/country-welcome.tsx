"use client"

import { useLocale } from "@/hooks/use-locale"

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

export function CountryWelcome() {
  const { locale, country } = useLocale()

  if (!locale || !country) return null

  const message =
    welcomeMessages[locale]?.[country] || welcomeMessages[locale]?.default || welcomeMessages["en-US"].default

  return (
    <div className="bg-primary/10 p-4 rounded-lg mb-6">
      <p className="text-sm">{message}</p>
    </div>
  )
}
