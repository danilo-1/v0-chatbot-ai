import { getServerSession } from "next-auth/next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Bot, MessageSquare, TrendingUp, Users, BarChart } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Get user ID from session
  const userId = session?.user?.id

  console.log("Dashboard page - User ID:", userId)

  // Fetch chatbots directly with SQL
  let chatbots = []
  let error = null
  const metrics = {
    totalChatbots: 0,
    publicChatbots: 0,
    totalMessages: 0,
    activeChats: 0,
  }

  try {
    if (userId) {
      // Get user's chatbots
      chatbots = await sql`
        SELECT * FROM "Chatbot"
        WHERE "userId" = ${userId}
        ORDER BY "createdAt" DESC
      `
      console.log(`Found ${chatbots.length} chatbots for user ${userId}`)

      // Get metrics
      const metricsResult = await sql`
        SELECT 
          COUNT(*) as "totalChatbots",
          SUM(CASE WHEN "isPublic" = true THEN 1 ELSE 0 END) as "publicChatbots"
        FROM "Chatbot"
        WHERE "userId" = ${userId}
      `

      if (metricsResult.length > 0) {
        metrics.totalChatbots = Number.parseInt(metricsResult[0].totalChatbots) || 0
        metrics.publicChatbots = Number.parseInt(metricsResult[0].publicChatbots) || 0
      }

      // For demo purposes, generate some random metrics
      // In a real app, these would come from actual database queries
      metrics.totalMessages = Math.floor(Math.random() * 1000) + 100
      metrics.activeChats = Math.floor(Math.random() * 50) + 5
    }
  } catch (e) {
    console.error("Error fetching chatbots:", e)
    error = e instanceof Error ? e.message : "Failed to fetch chatbots"
  }

  // Get recent chatbots (last 5)
  const recentChatbots = chatbots.slice(0, 5)

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

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error loading chatbots: {error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <DashboardMetrics metrics={metrics} />

      {/* Charts and Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCharts />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Your latest chatbot interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity chatbots={recentChatbots} />
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/telemetry">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks and resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/chatbots/new">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Bot className="h-6 w-6" />
                  <span>Create Chatbot</span>
                </Button>
              </Link>
              <Link href="/dashboard/chatbots">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Manage Chatbots</span>
                </Button>
              </Link>
              <Link href="/dashboard/telemetry">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Public Catalog</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
