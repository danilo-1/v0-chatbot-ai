import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request })

    // Check if the path starts with /dashboard
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (!token) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Check for admin routes
      if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
        // Only allow specific admin email
        if (token.email !== "danilo.nsantana.dns@gmail.com") {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // Continue to the application even if middleware fails
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
