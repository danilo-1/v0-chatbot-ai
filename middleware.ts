import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lista de idiomas suportados
const locales = ["en", "pt", "es"]
const defaultLocale = "en"

// Middleware de internacionalização
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

export async function middleware(request: NextRequest) {
  // Ignorar arquivos estáticos e API
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next()
  }

  // Aplicar middleware de internacionalização para rotas que não são API
  return intlMiddleware(request)
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|static|favicon.ico).*)",
  ],
}
