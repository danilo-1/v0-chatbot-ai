import { getServerSession } from "next-auth/next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, BarChart3, Users, MessageSquare, Zap, Activity as ActivityIcon } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { HelpResources } from "@/components/dashboard/help-resources"
import { SubscriptionStatus } from "@/components/dashboard/subscription-status"
import { UsageLimitsCard } from "@/components/dashboard/usage-limits-card"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb"
import { redirect } from "next/navigation"
// Componente de atividades recentes
import { Activity } from "@/components/dashboard/activity"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  // Verificar a sessão com tratamento de erro
  let session
  try {
    session = await getServerSession(authOptions)
    if (!session) {
      redirect("/login")
    }
  } catch (e) {
    console.error("Error getting session:", e)
    redirect("/login?error=session")
  }

  const userId = session?.user?.id

  // Fetch chatbots
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
    chatbots = []
  }

  // Fetch advanced analytics
  const analytics = {
    totalMessages: 0,
    totalSessions: 0,
    activeUsers: 0,
    avgResponseTime: 0,
    messagesGrowth: 0,
    usersGrowth: 0,
    avgSessionDuration: 0,
    topPerformingBot: null,
    peakHour: null,
  }

  const chartData = {
    dailyMessages: [],
    hourlyActivity: [],
    chatbotUsage: [],
    responseTimeDistribution: [],
  }

  try {
    if (userId && chatbots.length > 0) {
      const chatbotIds = chatbots.map((bot) => bot.id)

      // Basic metrics
      const [messagesResult, sessionsResult, activeUsersResult, avgTimeResult] = await Promise.all([
        sql`
          SELECT COUNT(*) as count
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
        `,
        sql`
          SELECT COUNT(DISTINCT "sessionId") as count
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
        `,
        sql`
          SELECT COUNT(DISTINCT "userId") as count
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
          AND "createdAt" > NOW() - INTERVAL '30 days'
        `,
        sql`
          SELECT AVG(EXTRACT(EPOCH FROM ("createdAt" - lag("createdAt") OVER (PARTITION BY "sessionId" ORDER BY "createdAt")))) as avg_time
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
          AND "role" = 'assistant'
        `,
      ])

      analytics.totalMessages = messagesResult?.[0]?.count || 0
      analytics.totalSessions = sessionsResult?.[0]?.count || 0
      analytics.activeUsers = activeUsersResult?.[0]?.count || 0
      analytics.avgResponseTime = Math.round(avgTimeResult?.[0]?.avg_time || 0)

      // Growth metrics (comparing last 30 days vs previous 30 days)
      const [currentPeriodMessages, previousPeriodMessages] = await Promise.all([
        sql`
          SELECT COUNT(*) as count
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
          AND "createdAt" > NOW() - INTERVAL '30 days'
        `,
        sql`
          SELECT COUNT(*) as count
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
          AND "createdAt" BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days'
        `,
      ])

      const currentMessages = currentPeriodMessages?.[0]?.count || 0
      const previousMessages = previousPeriodMessages?.[0]?.count || 1
      analytics.messagesGrowth = ((currentMessages - previousMessages) / previousMessages) * 100

      // Similar for users growth
      const [currentPeriodUsers, previousPeriodUsers] = await Promise.all([
        sql`
          SELECT COUNT(DISTINCT "userId") as count
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
          AND "createdAt" > NOW() - INTERVAL '30 days'
        `,
        sql`
          SELECT COUNT(DISTINCT "userId") as count
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
          AND "createdAt" BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days'
        `,
      ])

      const currentUsers = currentPeriodUsers?.[0]?.count || 0
      const previousUsers = previousPeriodUsers?.[0]?.count || 1
      analytics.usersGrowth = ((currentUsers - previousUsers) / previousUsers) * 100

      // Average session duration
      const sessionDurationResult = await sql`
        SELECT AVG(EXTRACT(EPOCH FROM ("endedAt" - "startedAt"))) as avg_duration
        FROM "ChatSession"
        WHERE "chatbotId" = ANY(${chatbotIds})
        AND "endedAt" IS NOT NULL
      `
      analytics.avgSessionDuration = sessionDurationResult?.[0]?.avg_duration || 0

      // Top performing chatbot
      const topBotResult = await sql`
        SELECT c.name, COUNT(m.id) as message_count
        FROM "Chatbot" c
        LEFT JOIN "ChatMessage" m ON c.id = m."chatbotId"
        WHERE c."userId" = ${userId}
        GROUP BY c.id, c.name
        ORDER BY message_count DESC
        LIMIT 1
      `
      if (topBotResult?.[0]) {
        analytics.topPerformingBot = {
          name: topBotResult[0].name,
          messages: topBotResult[0].message_count || 0,
        }
      }

      // Peak hour analysis
      const peakHourResult = await sql`
        SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*) as message_count
        FROM "ChatMessage"
        WHERE "chatbotId" = ANY(${chatbotIds})
        AND "createdAt" > NOW() - INTERVAL '7 days'
        GROUP BY EXTRACT(HOUR FROM "createdAt")
        ORDER BY message_count DESC
        LIMIT 1
      `
      if (peakHourResult?.[0]) {
        analytics.peakHour = {
          hour: peakHourResult[0].hour,
          messages: peakHourResult[0].message_count || 0,
        }
      }

      // Daily messages for chart
      const dailyMessagesResult = await sql`
        SELECT 
          DATE("createdAt") as date,
          COUNT(*) as messages,
          COUNT(DISTINCT "userId") as users
        FROM "ChatMessage"
        WHERE "chatbotId" = ANY(${chatbotIds})
        AND "createdAt" > NOW() - INTERVAL '30 days'
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
        LIMIT 30
      `
      chartData.dailyMessages = dailyMessagesResult
        .map((row) => ({
          date: new Date(row.date).toLocaleDateString("pt-BR", { month: "short", day: "numeric" }),
          messages: row.messages || 0,
          users: row.users || 0,
        }))
        .reverse()

      // Hourly activity
      const hourlyActivityResult = await sql`
        SELECT 
          EXTRACT(HOUR FROM "createdAt") as hour,
          COUNT(*) as messages
        FROM "ChatMessage"
        WHERE "chatbotId" = ANY(${chatbotIds})
        AND "createdAt" > NOW() - INTERVAL '7 days'
        GROUP BY EXTRACT(HOUR FROM "createdAt")
        ORDER BY hour
      `
      chartData.hourlyActivity = Array.from({ length: 24 }, (_, i) => {
        const hourData = hourlyActivityResult.find((row) => row.hour === i)
        return {
          hour: i,
          messages: hourData?.messages || 0,
        }
      })

      // Chatbot usage distribution
      const chatbotUsageResult = await sql`
        SELECT 
          c.name,
          COUNT(m.id) as messages
        FROM "Chatbot" c
        LEFT JOIN "ChatMessage" m ON c.id = m."chatbotId"
        WHERE c."userId" = ${userId}
        GROUP BY c.id, c.name
        ORDER BY messages DESC
        LIMIT 5
      `
      chartData.chatbotUsage = chatbotUsageResult.map((row, index) => ({
        name: row.name,
        messages: row.messages || 0,
        color: `hsl(${index * 60}, 70%, 50%)`,
      }))

      // Response time distribution
      const responseTimeResult = await sql`
        WITH response_times AS (
          SELECT 
            EXTRACT(EPOCH FROM ("createdAt" - lag("createdAt") OVER (PARTITION BY "sessionId" ORDER BY "createdAt"))) as response_time
          FROM "ChatMessage"
          WHERE "chatbotId" = ANY(${chatbotIds})
          AND "role" = 'assistant'
        )
        SELECT 
          CASE 
            WHEN response_time < 1 THEN '< 1s'
            WHEN response_time < 3 THEN '1-3s'
            WHEN response_time < 5 THEN '3-5s'
            WHEN response_time < 10 THEN '5-10s'
            ELSE '> 10s'
          END as range,
          COUNT(*) as count
        FROM response_times
        WHERE response_time IS NOT NULL
        GROUP BY range
        ORDER BY 
          CASE range
            WHEN '< 1s' THEN 1
            WHEN '1-3s' THEN 2
            WHEN '3-5s' THEN 3
            WHEN '5-10s' THEN 4
            ELSE 5
          END
      `
      chartData.responseTimeDistribution = responseTimeResult || []
    }
  } catch (e) {
    console.error("Error fetching analytics:", e)
  }

  // Recent chatbots
  let recentChatbots = []
  try {
    recentChatbots = await sql`
      SELECT * FROM "Chatbot" 
      WHERE "userId" = ${session.user.id}
      ORDER BY "updatedAt" DESC
      LIMIT 3
    `
  } catch (e) {
    console.error("Error fetching recent chatbots:", e)
  }

  return (
    <div className="container mx-auto space-y-6">
      <DashboardBreadcrumb />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está um resumo da atividade dos seus chatbots.
          </p>
        </div>
        <Link href="/dashboard/chatbots/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Chatbot
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Erro ao carregar chatbots: {error}</p>
        </div>
      )}

      {/* Analytics Cards */}
      <AnalyticsCards data={analytics} />

      {/* Charts Section */}
      {chatbots.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Análise Detalhada</h2>
          </div>
          <AnalyticsCharts data={chartData} />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>Seus chatbots mais ativos</CardDescription>
            </CardHeader>
            <CardContent>
              {chatbots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum chatbot criado ainda</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Crie seu primeiro chatbot para começar a interagir com seus usuários e gerar insights valiosos.
                  </p>
                  <Link href="/dashboard/chatbots/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Chatbot
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatbots.slice(0, 3).map((chatbot) => (
                    <div
                      key={chatbot.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{chatbot.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Criado em {new Date(chatbot.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/chatbots/${chatbot.id}/playground`}>
                          <Button variant="outline" size="sm">
                            <Zap className="mr-1 h-3 w-3" />
                            Testar
                          </Button>
                        </Link>
                        <Link href={`/dashboard/chatbots/${chatbot.id}/insights`}>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="mr-1 h-3 w-3" />
                            Insights
                          </Button>
                        </Link>
                        <Link href={`/dashboard/chatbots/${chatbot.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {chatbots.length > 3 && (
                    <div className="text-center pt-4 border-t">
                      <Link href="/dashboard/chatbots">
                        <Button variant="link">Ver todos os {chatbots.length} chatbots</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          {chatbots.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Guia de Início Rápido</CardTitle>
                <CardDescription>Crie seu primeiro chatbot em minutos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Criar chatbot</h4>
                        <p className="text-sm text-muted-foreground">Dê um nome e descrição</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Adicionar conhecimento</h4>
                        <p className="text-sm text-muted-foreground">Upload de documentos ou texto</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Personalizar</h4>
                        <p className="text-sm text-muted-foreground">Cores e estilo da marca</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Incorporar</h4>
                        <p className="text-sm text-muted-foreground">Adicionar ao seu site</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/chatbots/new" className="w-full">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Começar Agora
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Limits Card */}
          <UsageLimitsCard />

          {/* Subscription Status */}
          <SubscriptionStatus chatbotCount={chatbots.length} />

          {/* Help Resources */}
          <HelpResources />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às funcionalidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/chatbots/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Chatbot
                </Button>
              </Link>
              <Link href="/dashboard/documentation" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Documentação
                </Button>
              </Link>
              <Link href="/dashboard/admin/need-help" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Suporte
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
