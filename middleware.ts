import createMiddleware from "next-intl/middleware"
import type { NextRequest } from "next/server"

const intlMiddleware = createMiddleware({
  locales: ["en", "pt", "es"],
  defaultLocale: "en",
})

export default function middleware(request: NextRequest) {
  // Skip middleware for API routes, static files, and other special paths
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/favicon.ico") ||
    request.nextUrl.pathname.startsWith("/embed/") ||
    request.nextUrl.pathname.startsWith("/chatbot/") ||
    request.nextUrl.pathname.startsWith("/widget/")
  ) {
    return
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|embed|chatbot|widget).*)"],
}
