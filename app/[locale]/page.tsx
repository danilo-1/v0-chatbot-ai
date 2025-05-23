"use client"

import { Link } from "@/navigation"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("home")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-xl mb-8">{t("subtitle")}</p>
      <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {t("getStarted")}
      </Link>
    </main>
  )
}
