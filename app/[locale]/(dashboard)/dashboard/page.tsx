import { getServerSession } from "next-auth/next"
import { getTranslations } from "next-intl/server"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import DashboardClient from "./DashboardClient"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "dashboard" })

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

  return <DashboardClient chatbots={chatbots} error={error} insights={insights} locale={locale} />
}
