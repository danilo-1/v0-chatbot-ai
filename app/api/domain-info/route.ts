import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const hostname = request.headers.get("host") || ""

  // Extrair o TLD (com.br, com, es, etc.)
  const tldMatch = hostname.match(/\.([^.]+(?:\.[^.]+)?)$/)
  const tld = tldMatch ? tldMatch[1] : "com" // Fallback para .com

  // Obter o idioma do cookie
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en-US"

  return NextResponse.json({
    hostname,
    tld,
    locale,
  })
}
