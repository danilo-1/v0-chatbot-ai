"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Language = {
  code: string
  name: string
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  availableLanguages: Language[]
}

const availableLanguages: Language[] = [
  { code: "pt-BR", name: "Português" },
  { code: "en-US", name: "English" },
  { code: "es-ES", name: "Español" },
  { code: "fr-FR", name: "Français" },
  { code: "de-DE", name: "Deutsch" },
]

const defaultLanguage: Language = { code: "en-US", name: "English" }

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  availableLanguages,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    async function detectUserLanguage() {
      try {
        // Fetch user's country and language from API
        const response = await fetch("/api/detect-language")
        const data = await response.json()

        if (data.language) {
          const detectedLanguage =
            availableLanguages.find((lang) => lang.code.split("-")[0] === data.language.split("-")[0]) ||
            defaultLanguage

          setLanguage(detectedLanguage)
        }
      } catch (error) {
        console.error("Failed to detect language:", error)
        // Fallback to browser language
        const browserLang = navigator.language
        const detectedLanguage =
          availableLanguages.find((lang) => lang.code.split("-")[0] === browserLang.split("-")[0]) || defaultLanguage

        setLanguage(detectedLanguage)
      } finally {
        setIsInitialized(true)
      }
    }

    if (!isInitialized) {
      detectUserLanguage()
    }
  }, [isInitialized])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
