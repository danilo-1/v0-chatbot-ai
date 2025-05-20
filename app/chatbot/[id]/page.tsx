import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { ChatPlayground } from "@/components/chat-playground"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Disable caching for this page
export const dynamic = "force-dynamic"

interface ChatbotPageProps {
  params: {
    id: string
  }
}

export default async function ChatbotPage({ params }: ChatbotPageProps) {
  console.log(`Rendering public chatbot page for ID: ${params.id}`)

  // Fetch chatbot directly with SQL
  let chatbot = null
  let error = null

  try {
    const result = await sql`
      SELECT c.*, u.name as "userName"
      FROM "Chatbot" c
      JOIN "User" u ON c."userId" = u.id
      WHERE c.id = ${params.id}
    `

    if (result.length > 0) {
      chatbot = result[0]
      console.log("Found chatbot:", chatbot.name, "Public:", chatbot.isPublic)
    } else {
      console.log("Chatbot not found")
    }
  } catch (e) {
    console.error("Error fetching chatbot:", e)
    error = e instanceof Error ? e.message : "Failed to fetch chatbot"
  }

  if (!chatbot) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <span className="text-xl font-bold">ChatbotAI</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/catalog">
                <Button variant="outline">Back to Catalog</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container py-10">
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-xl font-medium mb-2">Chatbot not found</h2>
            <p className="text-muted-foreground mb-6">The chatbot you're looking for doesn't exist or isn't public.</p>
            <Link href="/catalog">
              <Button>Back to Catalog</Button>
            </Link>
          </div>
        </main>
        <footer className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">ChatbotAI</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2023 ChatbotAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    )
  }

  if (!chatbot.isPublic) {
    console.log("Chatbot not public, redirecting to catalog")
    redirect("/catalog")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <span className="text-xl font-bold">ChatbotAI</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/catalog">
              <Button variant="outline">Back to Catalog</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-10">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            {chatbot.imageUrl && (
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image src={chatbot.imageUrl || "/placeholder.svg"} alt={chatbot.name} fill className="object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{chatbot.name}</h1>
              {chatbot.description && <p className="text-muted-foreground mt-2">{chatbot.description}</p>}
              <p className="text-sm text-muted-foreground mt-1">Created by {chatbot.userName || "Anonymous"}</p>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              <p>Error: {error}</p>
            </div>
          )}

          <ChatPlayground chatbotId={chatbot.id} chatbotName={chatbot.name} chatbotImage={chatbot.imageUrl} />
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">ChatbotAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2023 ChatbotAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
