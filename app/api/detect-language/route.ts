import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get IP address from request headers
    const forwardedFor = request.headers.get("x-forwarded-for") || ""
    const ip = forwardedFor.split(",")[0].trim()

    // Use IP geolocation API to get country
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
    const geoData = await geoResponse.json()

    // Map country to language
    const countryToLanguage: Record<string, string> = {
      BR: "pt-BR",
      US: "en-US",
      GB: "en-US",
      ES: "es-ES",
      MX: "es-ES",
      FR: "fr-FR",
      DE: "de-DE",
      // Add more country-to-language mappings as needed
    }

    // Get language from country or fallback to Accept-Language header
    let language = countryToLanguage[geoData.country_code]

    if (!language) {
      const acceptLanguage = request.headers.get("accept-language") || ""
      language = acceptLanguage.split(",")[0]
    }

    return NextResponse.json({
      country: geoData.country_code,
      language,
      ip: process.env.NODE_ENV === "development" ? "127.0.0.1" : ip,
    })
  } catch (error) {
    console.error("Error detecting language:", error)
    return NextResponse.json({ error: "Failed to detect language" }, { status: 500 })
  }
}
