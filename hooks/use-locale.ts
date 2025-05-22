"use client"

import { useEffect, useState } from "react"
import { getCookie } from "cookies-next"

export function useLocale() {
  const [locale, setLocale] = useState<string>("en-US")
  const [country, setCountry] = useState<string | null>(null)

  useEffect(() => {
    // Obter o locale do cookie definido pelo middleware
    const detectedLocale = getCookie("NEXT_LOCALE") as string
    if (detectedLocale) {
      setLocale(detectedLocale)
    }

    // Obter informações do país para mensagem personalizada
    fetch("/api/user-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.country) {
          setCountry(data.country)
        }
      })
      .catch((err) => console.error("Erro ao obter informações do usuário:", err))
  }, [])

  return { locale, country }
}
