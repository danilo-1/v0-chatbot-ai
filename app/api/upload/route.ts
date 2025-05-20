import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Generate a unique filename
    const uniqueId = uuidv4()
    const extension = file.name.split(".").pop()
    const filename = `chatbot-${uniqueId}.${extension}`

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("File uploaded to Vercel Blob Storage:", blob.url)

    // Return the URL of the uploaded file
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
