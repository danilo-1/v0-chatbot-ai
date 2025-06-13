import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.error("Dashboard telemetry error:", data)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error processing telemetry:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
