"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, ReplaceIcon as Customize, MessageSquare } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ClientPage() {
  const t = useTranslations("home")
  const nav = useTranslations("navigation")
  const footer = useTranslations("footer")

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{t("hero.title")}</h1>
            <p className="mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">{t("hero.description")}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  {t("hero.createButton")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button size="lg" variant="outline">
                  {t("hero.exploreButton")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="bg-muted py-20">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">{t("features.title")}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <Briefcase className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{t("features.businessFaqs.title")}</h3>
                <p className="text-muted-foreground">{t("features.businessFaqs.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <Customize className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{t("features.customizable.title")}</h3>
                <p className="text-muted-foreground">{t("features.customizable.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <MessageSquare className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{t("features.intelligent.title")}</h3>
                <p className="text-muted-foreground">{t("features.intelligent.description")}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">{t("howItWorks.title")}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">{t("howItWorks.step1.title")}</h3>
                <p className="text-muted-foreground">{t("howItWorks.step1.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">{t("howItWorks.step2.title")}</h3>
                <p className="text-muted-foreground">{t("howItWorks.step2.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">{t("howItWorks.step3.title")}</h3>
                <p className="text-muted-foreground">{t("howItWorks.step3.description")}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-20">
          <div className="container">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter mb-6">{t("cta.title")}</h2>
              <p className="max-w-[600px] text-muted-foreground mb-8">{t("cta.description")}</p>
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  {t("cta.button")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
