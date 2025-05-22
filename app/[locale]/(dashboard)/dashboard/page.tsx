"use client"

import { getServerSession } from "next-auth/next"
import { useTranslations } from "next-intl"
import { unstable_setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, BarChart3, Users, MessageSquare, Clock } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { HelpResources } from "@/components/dashboard/help-resources"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  unstable_setRequestLocale(locale)

  const session = await getServerSession(authOptions)

  // Get user ID from session
  const userId = session?.user?.id

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
    }
  } catch (e) {
    console.error("Error fetching chatbots:", e)
    error = e instanceof Error ? e.message : "Failed to fetch chatbots"
  }

  // Fetch some basic insights
  const insights = {
    totalMessages: 0,
    totalSessions: 0,
    activeUsers: 0,
    avgResponseTime: 0,
  }

  try {
    if (userId) {
      // Get total messages across all chatbots
      const messagesResult = await sql`
        SELECT COUNT(*) as count
        FROM "ChatMessage"
        WHERE "chatbotId" IN (
          SELECT id FROM "Chatbot" WHERE "userId" = ${userId}
        )
      `
      insights.totalMessages = messagesResult[0]?.count || 0

      // Get total sessions
      const sessionsResult = await sql`
        SELECT COUNT(DISTINCT "sessionId") as count
        FROM "ChatMessage"
        WHERE "chatbotId" IN (
          SELECT id FROM "Chatbot" WHERE "userId" = ${userId}
        )
      `
      insights.totalSessions = sessionsResult[0]?.count || 0

      // Get active users (unique users in the last 30 days)
      const activeUsersResult = await sql`
        SELECT COUNT(DISTINCT "userId") as count
        FROM "ChatMessage"
        WHERE "chatbotId" IN (
          SELECT id FROM "Chatbot" WHERE "userId" = ${userId}
        )
        AND "createdAt" > NOW() - INTERVAL '30 days'
      `
      insights.activeUsers = activeUsersResult[0]?.count || 0

      // Get average response time
      const avgTimeResult = await sql`
        SELECT AVG(EXTRACT(EPOCH FROM ("createdAt" - lag("createdAt") OVER (PARTITION BY "sessionId" ORDER BY "createdAt")))) as avg_time
        FROM "ChatMessage"
        WHERE "chatbotId" IN (
          SELECT id FROM "Chatbot" WHERE "userId" = ${userId}
        )
        AND "role" = 'assistant'
      `
      insights.avgResponseTime = Math.round(avgTimeResult[0]?.avg_time || 0)
    }
  } catch (e) {
    console.error("Error fetching insights:", e)
    // Don't show error for insights, just use default values
  }

  const t = useTranslations("dashboard")
  const nav = useTranslations("navigation")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/chatbots/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("newChatbot")}
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error loading chatbots: {error}</p>
        </div>
      )}

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">{t("stats.totalChatbots")}</CardTitle>
            </div>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbots.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {chatbots.length === 0 ? t("createFirstChatbot") : t("manageChatbots")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">{t("stats.totalMessages")}</CardTitle>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("acrossAllChatbots")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">{t("stats.activeUsers")}</CardTitle>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("last30Days")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">{t("stats.responseTime")}</CardTitle>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.avgResponseTime > 0 ? `${insights.avgResponseTime}s` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t("timeToGenerate")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t("recentActivity.title")}</CardTitle>
              <CardDescription>{t("recentActivity.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {chatbots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-4">{t("recentActivity.noChatbots")}</p>
                  <Link href="/dashboard/chatbots/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> {t("recentActivity.createFirst")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatbots.slice(0, 3).map((chatbot) => (
                    <div key={chatbot.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h3 className="font-medium">{chatbot.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("recentActivity.createdOn")} {new Date(chatbot.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/chatbots/${chatbot.id}/edit`}>
                          <Button variant="outline" size="sm">
                            {t("recentActivity.edit")}
                          </Button>
                        </Link>
                        <Link href={`/dashboard/chatbots/${chatbot.id}/insights`}>
                          <Button variant="outline" size="sm">
                            {t("recentActivity.insights")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {chatbots.length > 3 && (
                    <div className="text-center pt-2">
                      <Link href="/dashboard/chatbots">
                        <Button variant="link">{t("recentActivity.viewAll")}</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle>{t("quickStart.title")}</CardTitle>
              <CardDescription>{t("quickStart.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>
                  <strong>{t("quickStart.step1")}</strong> - {t("quickStart.step1Description")}
                </li>
                <li>
                  <strong>{t("quickStart.step2")}</strong> - {t("quickStart.step2Description")}
                </li>
                <li>
                  <strong>{t("quickStart.step3")}</strong> - {t("quickStart.step3Description")}
                </li>
                <li>
                  <strong>{t("quickStart.step4")}</strong> - {t("quickStart.step4Description")}
                </li>
                <li>
                  <strong>{t("quickStart.step5")}</strong> - {t("quickStart.step5Description")}
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/chatbots/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> {t("quickStart.startBuilding")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Help Resources */}
          <HelpResources />

          {/* Popular Templates */}
          <Card>
            <CardHeader>
              <CardTitle>{t("templates.title")}</CardTitle>
              <CardDescription>{t("templates.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span className="text-sm">{t("templates.customerSupport")}</span>
                  <Button variant="ghost" size="sm">
                    {t("templates.use")}
                  </Button>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm">{t("templates.productFaq")}</span>
                  <Button variant="ghost" size="sm">
                    {t("templates.use")}
                  </Button>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm">{t("templates.leadGeneration")}</span>
                  <Button variant="ghost" size="sm">
                    {t("templates.use")}
                  </Button>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/templates">
                <Button variant="outline" size="sm" className="w-full">
                  {t("templates.viewAll")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
