"use client"

import { useEffect, useState } from "react"
import { getCookie } from "cookies-next"

const welcomeMessages: Record<string, string> = {
  "pt-BR": "Bem-vindo ao ChatbotAI!",
  "en-US": "Welcome to ChatbotAI!",
  "es-ES": "¡Bienvenido a ChatbotAI!",
  "fr-FR": "Bienvenue sur ChatbotAI !",
  "de-DE": "Willkommen bei ChatbotAI!",
}

export function LocalizedWelcome() {
  const [locale, setLocale] = useState<string>("en-US")

  useEffect(() => {
    const detectedLocale = getCookie("NEXT_LOCALE") as string
    if (detectedLocale) {
      setLocale(detectedLocale)
    }
  }, [])

  const message = welcomeMessages[locale] || welcomeMessages["en-US"]

  return (
    <div className="bg-primary/10 p-4 rounded-lg mb-6">
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-1">Idioma atual: {locale}</p>
    </div>
  )
}
