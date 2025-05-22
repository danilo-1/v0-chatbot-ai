"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createSharedPathnamesNavigation } from "next-intl/navigation"

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

const locales = ["en", "pt", "es", "fr", "de"]
const { usePathname: useI18nPathname, Link } = createSharedPathnamesNavigation({ locales })

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const i18nPathname = useI18nPathname()

  const handleLanguageChange = (langCode: string) => {
    // Construir a nova URL com o idioma selecionado
    const segments = pathname.split("/")
    segments[1] = langCode // O primeiro segmento após a barra é o idioma
    const newPathname = segments.join("/")

    router.push(newPathname)
  }

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0]

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
