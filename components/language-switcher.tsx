"use client"

import { useState } from "react"
import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  { code: "pt-BR", name: "Português" },
  { code: "en-US", name: "English" },
  { code: "es-ES", name: "Español" },
  { code: "fr-FR", name: "Français" },
  { code: "de-DE", name: "Deutsch" },
]

export function LanguageSwitcher() {
  const [language, setLanguage] = useState("pt-BR")

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
    // Aqui você implementaria a lógica para mudar o idioma da aplicação
    // Por exemplo, usando i18n ou outro sistema de internacionalização
  }

  const currentLanguage = languages.find((lang) => lang.code === language)?.name || "Português"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between"
          >
            {lang.name}
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
