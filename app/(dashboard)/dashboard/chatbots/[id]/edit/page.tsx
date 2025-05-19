import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { sql } from "@/lib/db"
import { ChatbotSettings } from "@/components/chatbot-settings"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Chatbot</h1>
        <p className="text-muted-foreground">Update your chatbot's settings and knowledge base.</p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
        </div>
      )}

      <ChatbotSettings chatbot={chatbot} />
    </div>
  )
}
