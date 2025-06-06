import { getTranslations } from "next-intl/server"
import ClientPage from "./ClientPage"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  return <ClientPage />
}
