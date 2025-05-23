"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HelpResources() {
  const t = useTranslations("help")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{t("description")}</p>
        <ul className="space-y-2 mb-4">
          <li className="text-sm">• {t("topics.knowledgeBases")}</li>
          <li className="text-sm">• {t("topics.responses")}</li>
          <li className="text-sm">• {t("topics.integration")}</li>
          <li className="text-sm">• {t("topics.bestPractices")}</li>
        </ul>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/documentation">{t("viewDocs")}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
