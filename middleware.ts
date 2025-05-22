import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

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

// Mapeamento de TLDs para idiomas
const domainToLocale: Record<string, string> = {
  "com.br": "pt-BR",
  br: "pt-BR",
  com: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  // Adicione mais mapeamentos conforme necessário
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/catalog",
    "/api/health",
    "/api/debug",
    "/api/init-db",
    "/api/db-setup",
    "/api/db-repair",
  ]

  // Check if the path is public or starts with certain prefixes
  const isPublicPath =
    publicPaths.includes(path) ||
    path.startsWith("/api/auth") ||
    path.startsWith("/chatbot/") ||
    path.startsWith("/embed/") ||
    path.startsWith("/api/chatbots/") ||
    path.startsWith("/api/v1/") ||
    path.startsWith("/api/widget/")

  // If it's not a public path, check for authentication
  if (!isPublicPath) {
    const token = await getToken({ req: request })

    // If no token, redirect to login
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }

  // Ignorar arquivos estáticos e API
  if (path.startsWith("/_next") || path.startsWith("/api") || path.includes(".")) {
    return NextResponse.next()
  }

  // Obter o país do cabeçalho Cloudflare ou similar
  const country = request.geo?.country || "US"

  // Determinar o locale com base no país
  const localeFromCountry = countryToLocale[country] || "en-US"

  // Detectar idioma com base no domínio
  const hostname = request.headers.get("host") || ""

  // Extrair o TLD (com.br, com, es, etc.)
  const tldMatch = hostname.match(/\.([^.]+(?:\.[^.]+)?)$/)
  const tld = tldMatch ? tldMatch[1] : "com" // Fallback para .com

  // Determinar o locale com base no TLD
  const localeFromDomain = domainToLocale[tld] || "en-US"

  // Use the locale from the domain if available, otherwise use the country locale
  const locale = localeFromDomain || localeFromCountry

  // Definir o cookie de idioma
  const response = NextResponse.next()
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  })

  // Add CORS headers for API routes
  if (path.startsWith("/api/")) {
    // Add CORS headers for API routes
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  return response
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
