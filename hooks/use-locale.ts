"use client"

import { useEffect, useState } from "react"
import { getCookie } from "cookies-next"

export function useLocale() {
  const [locale, setLocale] = useState<string>("en-US")
  const [domain, setDomain] = useState<string | null>(null)

  useEffect(() => {
    // Obter o locale do cookie definido pelo middleware
    const detectedLocale = getCookie("NEXT_LOCALE") as string
    if (detectedLocale) {
      setLocale(detectedLocale)
    }

    // Obter o domínio atual
    const currentDomain = window.location.hostname
    setDomain(currentDomain)

    // Obter informações do domínio para mensagem personalizada
    fetch("/api/domain-info")
      .then((res) => res.json())
      .catch((err) => console.error("Erro ao obter informações do domínio:", err))
  }, [])

  return { locale, domain }
}
