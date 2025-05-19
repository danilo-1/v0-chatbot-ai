import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the current DATABASE_URL
    const dbUrl = process.env.DATABASE_URL || ""
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set",
      })
    }

    // Parse the URL
    let urlObj: URL
    try {
      urlObj = new URL(dbUrl)
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: "Invalid DATABASE_URL format",
        details: error instanceof Error ? error.message : String(error),
      })
    }

    // Analyze the current URL
    const analysis = {
      host: urlObj.hostname,
      port: urlObj.port || "5432",
      database: urlObj.pathname.substring(1), // Remove leading slash
      hasPooled: urlObj.searchParams.has("pooled"),
      pooledValue: urlObj.searchParams.get("pooled"),
      hasSslMode: urlObj.searchParams.has("sslmode"),
      sslModeValue: urlObj.searchParams.get("sslmode"),
      hasConnectionLimit: urlObj.searchParams.has("connection_limit"),
      connectionLimitValue: urlObj.searchParams.get("connection_limit"),
      otherParams: Array.from(urlObj.searchParams.entries())
        .filter(([key]) => !["pooled", "sslmode", "connection_limit"].includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    }

    // Create suggestions for improved connection strings
    const suggestions = []

    // Suggestion 1: Standard connection with pooling
    const suggestion1 = new URL(dbUrl)
    suggestion1.searchParams.set("pooled", "true")
    if (!suggestion1.searchParams.has("sslmode")) {
      suggestion1.searchParams.set("sslmode", "require")
    }
    suggestions.push({
      name: "Standard with pooling",
      url: suggestion1.toString().replace(/\/\/([^:]+):([^@]+)@/, "//****:****@"),
      changes: ["Added pooled=true", "Ensured sslmode=require"],
    })

    // Suggestion 2: Connection with connection limit
    const suggestion2 = new URL(dbUrl)
    suggestion2.searchParams.set("connection_limit", "5")
    if (!suggestion2.searchParams.has("sslmode")) {
      suggestion2.searchParams.set("sslmode", "require")
    }
    suggestions.push({
      name: "With connection limit",
      url: suggestion2.toString().replace(/\/\/([^:]+):([^@]+)@/, "//****:****@"),
      changes: ["Added connection_limit=5", "Ensured sslmode=require"],
    })

    // Suggestion 3: Try without SSL (for testing only)
    const suggestion3 = new URL(dbUrl)
    suggestion3.searchParams.set("sslmode", "disable")
    suggestions.push({
      name: "Without SSL (testing only)",
      url: suggestion3.toString().replace(/\/\/([^:]+):([^@]+)@/, "//****:****@"),
      changes: ["Set sslmode=disable"],
      warning: "Not recommended for production use",
    })

    // Suggestion 4: Direct connection (no pooling)
    const suggestion4 = new URL(dbUrl)
    suggestion4.searchParams.delete("pooled")
    if (!suggestion4.searchParams.has("sslmode")) {
      suggestion4.searchParams.set("sslmode", "require")
    }
    suggestions.push({
      name: "Direct connection (no pooling)",
      url: suggestion4.toString().replace(/\/\/([^:]+):([^@]+)@/, "//****:****@"),
      changes: ["Removed pooled parameter", "Ensured sslmode=require"],
    })

    return NextResponse.json({
      success: true,
      currentUrl: dbUrl.replace(/\/\/([^:]+):([^@]+)@/, "//****:****@"),
      analysis,
      suggestions,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
