import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

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

  // Ignorar arquivos estáticos e API
  if (path.startsWith("/_next") || path.includes(".")) {
    return NextResponse.next()
  }

  // If it's not a public path, check for authentication
  if (!isPublicPath) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // If no token, redirect to login
      if (!token) {
        // IMPORTANTE: Verificar se já estamos na página de login para evitar redirecionamentos recursivos
        if (path.includes("/login")) {
          return NextResponse.next()
        }

        // Redirecionar para login sem adicionar callbackUrl se já estiver presente na URL
        const url = new URL("/login", request.url)

        // Só adicionar callbackUrl se não for um redirecionamento de login para login
        if (!request.nextUrl.searchParams.has("callbackUrl")) {
          url.searchParams.set("callbackUrl", request.nextUrl.pathname)
        }

        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Middleware authentication error:", error)
      // Em caso de erro na autenticação, redirecionar para login com parâmetro de erro
      return NextResponse.redirect(new URL("/login?error=auth", request.url))
    }
  }

  // Add CORS headers for API routes
  if (path.startsWith("/api/")) {
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return response
  }

  return NextResponse.next()
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
