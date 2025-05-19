import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    // Existing middleware logic here

    // Return the response
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)

    // Log detailed information about the request
    console.error("Request URL:", request.url)
    console.error("Request method:", request.method)
    console.error("Request headers:", Object.fromEntries(request.headers))

    // Continue to the application, which will handle the error
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
