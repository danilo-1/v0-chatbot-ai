import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export type ChatSessionData = {
  chatbotId: string
  userId?: string
  visitorId?: string
  source?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
}

export type ChatMessageData = {
  sessionId: string
  role: "user" | "assistant" | "system"
  content: string
  tokens?: number
  modelId?: string
}

export async function createChatSession(data: ChatSessionData): Promise<string> {
  try {
    const sessionId = uuidv4()
    await sql`
      INSERT INTO "ChatSession" (
        "id", "chatbotId", "userId", "visitorId", "source", "referrer", "userAgent", "ipAddress"
      ) VALUES (
        ${sessionId}, ${data.chatbotId}, ${data.userId || null}, ${data.visitorId || null}, 
        ${data.source || null}, ${data.referrer || null}, ${data.userAgent || null}, ${data.ipAddress || null}
      )
    `
    return sessionId
  } catch (error) {
    console.error("Error creating chat session:", error)
    throw error
  }
}

export async function endChatSession(sessionId: string, messageCount: number): Promise<void> {
  try {
    await sql`
      UPDATE "ChatSession"
      SET "endedAt" = CURRENT_TIMESTAMP, "messageCount" = ${messageCount}
      WHERE "id" = ${sessionId}
    `
  } catch (error) {
    console.error("Error ending chat session:", error)
    throw error
  }
}

export async function logChatMessage(data: ChatMessageData): Promise<string> {
  try {
    const messageId = uuidv4()
    await sql`
      INSERT INTO "ChatMessage" (
        "id", "sessionId", "role", "content", "tokens", "modelId"
      ) VALUES (
        ${messageId}, ${data.sessionId}, ${data.role}, ${data.content}, 
        ${data.tokens || null}, ${data.modelId || null}
      )
    `
    return messageId
  } catch (error) {
    console.error("Error logging chat message:", error)
    throw error
  }
}

export async function updateDailyMetrics(chatbotId: string, date: Date): Promise<void> {
  try {
    const dateStr = date.toISOString().split("T")[0]

    // Calculate metrics for the day
    const metrics = await sql`
      WITH session_metrics AS (
        SELECT
          COUNT(*) as session_count,
          COUNT(DISTINCT "userId") + COUNT(DISTINCT "visitorId") as unique_users,
          SUM("messageCount") as message_count,
          AVG("messageCount") as avg_messages_per_session,
          AVG(EXTRACT(EPOCH FROM ("endedAt" - "startedAt"))) as avg_session_duration
        FROM "ChatSession"
        WHERE "chatbotId" = ${chatbotId}
        AND DATE("startedAt") = ${dateStr}::date
        AND "endedAt" IS NOT NULL
      )
      SELECT * FROM session_metrics
    `

    if (metrics.length === 0 || !metrics[0].session_count) {
      return // No data for this day
    }

    const { session_count, unique_users, message_count, avg_messages_per_session, avg_session_duration } = metrics[0]

    // Upsert daily metrics
    await sql`
      INSERT INTO "ChatbotDailyMetric" (
        "id", "chatbotId", "date", "sessionCount", "messageCount", 
        "uniqueUsers", "averageMessagesPerSession", "averageSessionDuration"
      ) VALUES (
        ${uuidv4()}, ${chatbotId}, ${dateStr}::date, ${session_count || 0}, 
        ${message_count || 0}, ${unique_users || 0}, ${avg_messages_per_session || 0}, 
        ${avg_session_duration || 0}
      )
      ON CONFLICT ("chatbotId", "date") 
      DO UPDATE SET
        "sessionCount" = ${session_count || 0},
        "messageCount" = ${message_count || 0},
        "uniqueUsers" = ${unique_users || 0},
        "averageMessagesPerSession" = ${avg_messages_per_session || 0},
        "averageSessionDuration" = ${avg_session_duration || 0}
    `
  } catch (error) {
    console.error("Error updating daily metrics:", error)
    throw error
  }
}

export async function getChatbotInsights(chatbotId: string, days = 30) {
  try {
    // Get total metrics
    const totalMetrics = await sql`
      SELECT
        COUNT(*) as total_sessions,
        SUM("messageCount") as total_messages,
        COUNT(DISTINCT "userId") + COUNT(DISTINCT "visitorId") as total_users,
        AVG("messageCount") as avg_messages_per_session,
        AVG(EXTRACT(EPOCH FROM ("endedAt" - "startedAt"))) as avg_session_duration
      FROM "ChatSession"
      WHERE "chatbotId" = ${chatbotId}
      AND "endedAt" IS NOT NULL
    `

    // Get daily metrics for the chart
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const dailyMetrics = await sql`
      SELECT
        "date",
        "sessionCount",
        "messageCount",
        "uniqueUsers",
        "averageMessagesPerSession",
        "averageSessionDuration"
      FROM "ChatbotDailyMetric"
      WHERE "chatbotId" = ${chatbotId}
      AND "date" BETWEEN ${startDate.toISOString().split("T")[0]}::date AND ${endDate.toISOString().split("T")[0]}::date
      ORDER BY "date" ASC
    `

    // Get most active users
    const activeUsers = await sql`
      SELECT
        "userId",
        COUNT(*) as session_count,
        SUM("messageCount") as message_count
      FROM "ChatSession"
      WHERE "chatbotId" = ${chatbotId}
      AND "userId" IS NOT NULL
      GROUP BY "userId"
      ORDER BY message_count DESC
      LIMIT 5
    `

    // Get most common user queries
    const commonQueries = await sql`
      SELECT
        "content",
        COUNT(*) as count
      FROM "ChatMessage"
      WHERE "sessionId" IN (
        SELECT "id" FROM "ChatSession" WHERE "chatbotId" = ${chatbotId}
      )
      AND "role" = 'user'
      GROUP BY "content"
      ORDER BY count DESC
      LIMIT 10
    `

    return {
      totalMetrics: totalMetrics[0] || {
        total_sessions: 0,
        total_messages: 0,
        total_users: 0,
        avg_messages_per_session: 0,
        avg_session_duration: 0,
      },
      dailyMetrics: dailyMetrics || [],
      activeUsers: activeUsers || [],
      commonQueries: commonQueries || [],
    }
  } catch (error) {
    console.error("Error getting chatbot insights:", error)
    throw error
  }
}
