import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Obter o país do cabeçalho Cloudflare ou similar
  const country = request.geo?.country || "US"

  // Obter o idioma do cookie
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en-US"

  return NextResponse.json({
    country,
    locale,
  })
}
