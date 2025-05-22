import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lista de idiomas suportados
const supportedLocales = ["en-US", "pt-BR", "es-ES", "fr-FR", "de-DE"]

// Mapeamento de países para idiomas
const countryToLocale: Record<string, string> = {
  BR: "pt-BR",
  US: "en-US",
  GB: "en-US",
  ES: "es-ES",
  MX: "es-ES",
  FR: "fr-FR",
  DE: "de-DE",
  // Adicione mais mapeamentos conforme necessário
}

export function middleware(request: NextRequest) {
  // Obter o idioma atual da URL (se existir)
  const pathname = request.nextUrl.pathname

  // Ignorar arquivos estáticos e API
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Obter o país do cabeçalho Cloudflare ou similar
  const country = request.geo?.country || "US"

  // Determinar o locale com base no país
  const locale = countryToLocale[country] || "en-US"

  // Definir o cookie de idioma
  const response = NextResponse.next()
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  })

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
