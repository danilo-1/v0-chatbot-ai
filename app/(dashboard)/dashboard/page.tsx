import { getServerSession } from "next-auth/next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { HelpResources } from "@/components/dashboard/help-resources"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Get user ID from session
  const userId = session?.user?.id

  console.log("Dashboard page - User ID:", userId)

  // Fetch chatbots directly with SQL
  let chatbots = []
  let error = null

  try {
    if (userId) {
      chatbots = await sql`
        SELECT * FROM "Chatbot"
        WHERE "userId" = ${userId}
        ORDER BY "createdAt" DESC
      `
      console.log(`Found ${chatbots.length} chatbots for user ${userId}`)
    }
  } catch (e) {
    console.error("Error fetching chatbots:", e)
    error = e instanceof Error ? e.message : "Failed to fetch chatbots"
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Conteúdo principal do dashboard */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome to ChatbotAI</h2>
            <p className="text-muted-foreground">
              Get started by creating a new chatbot or managing your existing ones.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              <p>Error loading chatbots: {error}</p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Welcome, {session?.user?.name}!</CardTitle>
                <CardDescription>Manage your AI chatbots and create new ones.</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">
                  You currently have <strong>{chatbots.length}</strong> chatbot{chatbots.length === 1 ? "" : "s"}.
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/chatbots">
                  <Button variant="outline">View All Chatbots</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Create your first AI chatbot in minutes.</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>Add your business knowledge</li>
                  <li>Customize responses and behavior</li>
                  <li>Test and refine your chatbot</li>
                  <li>Share with your customers</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/chatbots/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Chatbot
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sidebar com recursos úteis */}
          <HelpResources />

          {/* Outros componentes da sidebar */}
        </div>
      </div>
    </div>
  )
}
