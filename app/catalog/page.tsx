import Link from "next/link"
import Image from "next/image"
import { getPublicChatbots } from "@/backend/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"

export default async function CatalogPage() {
  const chatbots = await getPublicChatbots()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <span className="text-xl font-bold">ChatbotAI</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">Chatbot Catalog</h1>
        <p className="text-muted-foreground mb-10">Explore our collection of public chatbots created by our users.</p>

        {chatbots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-xl font-medium mb-2">No chatbots available yet</h2>
            <p className="text-muted-foreground mb-6">Be the first to create and share a chatbot!</p>
            <Link href="/login">
              <Button>Create a Chatbot</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chatbots.map((chatbot) => (
              <Card key={chatbot.id}>
                <CardHeader className="pb-3">
                  <CardTitle>{chatbot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {chatbot.imageUrl ? (
                    <div className="relative aspect-video overflow-hidden rounded-md mb-4">
                      <Image
                        src={chatbot.imageUrl || "/placeholder.svg"}
                        alt={chatbot.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center aspect-video bg-muted rounded-md mb-4">
                      <Bot className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {chatbot.description || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">By {chatbot.user.name || "Anonymous"}</div>
                  <Link href={`/chatbot/${chatbot.id}`}>
                    <Button variant="outline" size="sm">
                      Try it
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
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
