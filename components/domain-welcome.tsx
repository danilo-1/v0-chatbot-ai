"use client"

import { useLocale } from "@/hooks/use-locale"

const welcomeMessages: Record<string, Record<string, string>> = {
  "pt-BR": {
    default: "Bem-vindo ao ChatbotAI Brasil!",
  },
  "en-US": {
    default: "Welcome to ChatbotAI!",
  },
  "es-ES": {
    default: "¡Bienvenido a ChatbotAI España!",
  },
  "fr-FR": {
    default: "Bienvenue sur ChatbotAI France !",
  },
  "de-DE": {
    default: "Willkommen bei ChatbotAI Deutschland!",
  },
}

export function DomainWelcome() {
  const { locale, domain } = useLocale()

  if (!locale) return null

  const message = welcomeMessages[locale]?.default || welcomeMessages["en-US"].default

  return (
    <div className="bg-primary/10 p-4 rounded-lg mb-6">
      <p className="text-sm">{message}</p>
      <p className="text-xs text-muted-foreground mt-1">Você está acessando: {domain}</p>
    </div>
  )
}
