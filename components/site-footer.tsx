"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Bot } from "lucide-react"

export function SiteFooter() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">ChatbotAI</span>
        </div>
        <p className="text-sm text-muted-foreground">{t("copyright")}</p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            {t("privacyPolicy")}
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            {t("termsOfService")}
          </Link>
        </div>
      </div>
    </footer>
  )
}
