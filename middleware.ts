import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Lista de idiomas suportados
const locales = ["en", "pt", "es", "fr", "de"]
const defaultLocale = "en"

// Middleware de internacionalização
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

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

  // Aplicar middleware de internacionalização
  const response = intlMiddleware(request)

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
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
