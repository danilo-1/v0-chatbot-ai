import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { ChatbotSettings } from "@/components/chatbot-settings"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"

// Disable caching for this page
export const dynamic = "force-dynamic"

interface EditChatbotPageProps {
  params: {
    id: string
  }
}

export default async function EditChatbotPage({ params }: EditChatbotPageProps) {
  console.log("Rendering edit page for chatbot:", params.id)

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    console.log("No user session, redirecting to login")
    redirect("/login")
  }

  // Fetch chatbot directly with SQL
  let chatbot = null
  let error = null

  try {
    const result = await sql`
      SELECT * FROM "Chatbot"
      WHERE id = ${params.id}
    `

    if (result.length > 0) {
      chatbot = result[0]
      console.log("Found chatbot:", chatbot.name)
    } else {
      console.log("Chatbot not found")
    }
  } catch (e) {
    console.error("Error fetching chatbot:", e)
    error = e instanceof Error ? e.message : "Failed to fetch chatbot"
  }

  if (!chatbot) {
    console.log("Chatbot not found, redirecting to chatbots list")
    redirect("/dashboard/chatbots")
  }

  // Check if user owns this chatbot
  if (chatbot.userId !== session.user.id) {
    console.log("User does not own this chatbot, redirecting to chatbots list")
    redirect("/dashboard/chatbots")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Chatbot</h1>
          <p className="text-muted-foreground">Update your chatbot's settings and knowledge base.</p>
        </div>
        <Link href={`/dashboard/chatbots/${params.id}/embed`}>
          <Button variant="outline">
            <Code className="mr-2 h-4 w-4" />
            Implementar no meu site
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
        </div>
      )}

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="embed">Implementar</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <ChatbotSettings chatbot={chatbot} />
        </TabsContent>

        <TabsContent value="embed">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Implementar Chatbot</h2>
            <p className="mb-4">Adicione este chatbot ao seu site ou aplicativo.</p>
            <Link href={`/dashboard/chatbots/${params.id}/embed`}>
              <Button>
                <Code className="mr-2 h-4 w-4" />
                Ver opções de implementação
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
