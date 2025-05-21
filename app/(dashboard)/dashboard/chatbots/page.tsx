import { getServerSession } from "next-auth/next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Code, Edit, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DeleteChatbotButton } from "@/components/delete-chatbot-button"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function ChatbotsPage() {
  const session = await getServerSession(authOptions)

  // Get user ID from session
  const userId = session?.user?.id

  console.log("Chatbots page - User ID:", userId)

  // Fetch chatbots directly with SQL
  let chatbots = []
  let error = null

  try {
    if (userId) {
      chatbots = await sql`
        SELECT c.*, u.name as "userName"
        FROM "Chatbot" c
        JOIN "User" u ON c."userId" = u.id
        WHERE c."userId" = ${userId}
        ORDER BY c."createdAt" DESC
      `
      console.log(`Found ${chatbots.length} chatbots for user ${userId}`)
    }
  } catch (e) {
    console.error("Error fetching chatbots:", e)
    error = e instanceof Error ? e.message : "Failed to fetch chatbots"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Chatbots</h1>
        <Link href="/dashboard/chatbots/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Chatbot
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error loading chatbots: {error}</p>
        </div>
      )}

      {chatbots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bot className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No chatbots yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Create your first AI chatbot to help answer questions about your business automatically.
          </p>
          <Link href="/dashboard/chatbots/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Chatbot
            </Button>
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <div className={`mr-2 h-3 w-3 rounded-full ${chatbot.isPublic ? "bg-green-500" : "bg-yellow-500"}`} />
                  {chatbot.isPublic ? "Public" : "Private"}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Link href={`/dashboard/chatbots/${chatbot.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <DeleteChatbotButton id={chatbot.id} />
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/chatbots/${chatbot.id}/playground`}>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Playground
                    </Button>
                  </Link>
                  <Link href={`/dashboard/chatbots/${chatbot.id}/embed`}>
                    <Button variant="outline" size="sm">
                      <Code className="mr-2 h-4 w-4" />
                      Embed
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
