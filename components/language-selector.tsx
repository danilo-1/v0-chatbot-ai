"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCookie } from "cookies-next"

interface Language {
  name: string
  code: string
  flag: string
}

const languages: Language[] = [
  { name: "English", code: "en", flag: "🇺🇸" },
  { name: "Português", code: "pt", flag: "🇧🇷" },
  { name: "Español", code: "es", flag: "🇪🇸" },
  { name: "Français", code: "fr", flag: "🇫🇷" },
  { name: "Deutsch", code: "de", flag: "🇩🇪" },
]

export function LanguageSelector() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<string>("en-US")

  useEffect(() => {
    const locale = getCookie("NEXT_LOCALE") as string
    if (locale) {
      setCurrentLocale(locale)
    }
  }, [])

  const getCurrentLanguage = () => {
    const code = currentLocale.split("-")[0]
    return languages.find((lang) => lang.code === code) || languages[0]
  }

  const handleLanguageChange = (langCode: string) => {
    // Adicionar o parâmetro de idioma à URL atual
    const url = new URL(window.location.href)
    url.searchParams.set("lang", langCode)

    // Navegar para a nova URL
    router.push(url.toString())

    // Recarregar a página para aplicar as mudanças
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const currentLang = getCurrentLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {currentLang.flag} {currentLang.name}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2"
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
            {currentLang.code === language.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
