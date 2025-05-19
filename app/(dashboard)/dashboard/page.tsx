import { getServerSession } from "next-auth/next"
import { getChatbotsByUserId } from "@/backend/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession()
  const chatbots = await getChatbotsByUserId(session?.user?.id || "")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/chatbots/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Chatbot
          </Button>
        </Link>
      </div>

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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Resources to get the most out of your chatbot.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>How to write effective knowledge bases</li>
              <li>Optimizing chatbot responses</li>
              <li>Integrating with your website</li>
              <li>Best practices for AI chatbots</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="#">View Documentation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
