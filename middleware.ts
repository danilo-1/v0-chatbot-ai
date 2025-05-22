import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Lista de idiomas suportados
const supportedLocales = ["en-US", "pt-BR", "es-ES", "fr-FR", "de-DE"]

// Mapeamento de códigos de idioma para locales completos
const languageToLocale: Record<string, string> = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
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

  // 1. Verificar se há um parâmetro de idioma na URL (ex: ?lang=pt)
  const { searchParams } = request.nextUrl
  const langParam = searchParams.get("lang")
  let locale = langParam ? languageToLocale[langParam] || "en-US" : null

  // 2. Se não houver parâmetro, verificar o subdomínio (ex: pt.chatbotai.vercel.app)
  if (!locale) {
    const hostname = request.headers.get("host") || ""
    const subdomain = hostname.split(".")[0]

    // Verificar se o subdomínio é um código de idioma válido
    if (subdomain && languageToLocale[subdomain]) {
      locale = languageToLocale[subdomain]
    }
  }

  // 3. Se ainda não tiver um locale, verificar o cabeçalho Accept-Language
  if (!locale) {
    const acceptLanguage = request.headers.get("accept-language") || ""
    const preferredLanguage = acceptLanguage.split(",")[0].split("-")[0]
    locale = languageToLocale[preferredLanguage] || "en-US"
  }

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
