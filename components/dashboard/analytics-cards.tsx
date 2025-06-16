"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, MessageSquare, Users, Clock, Zap, Calendar, Activity } from "lucide-react"

interface AnalyticsData {
  totalChatbots: number
  totalMessages: number
  totalSessions: number
  activeUsers: number
  avgResponseTime: number
  messagesGrowth: number
  usersGrowth: number
  topPerformingBot?: {
    name: string
    messages: number
  }
  peakHour?: {
    hour: number
    messages: number
  }
  avgSessionDuration: number
}

interface AnalyticsCardsProps {
  data: AnalyticsData
}

export function AnalyticsCards({ data }: AnalyticsCardsProps) {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0
    return (
      <div className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span className="text-xs font-medium">
          {isPositive ? "+" : ""}
          {growth.toFixed(1)}%
        </span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Messages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Mensagens Totais</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </div>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalMessages.toLocaleString()}</div>
          {formatGrowth(data.messagesGrowth)}
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeUsers.toLocaleString()}</div>
          {formatGrowth(data.usersGrowth)}
        </CardContent>
      </Card>

      {/* Avg Response Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <CardDescription>Média geral</CardDescription>
          </div>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.avgResponseTime > 0 ? `${data.avgResponseTime}s` : "N/A"}</div>
          <Badge variant={data.avgResponseTime < 3 ? "default" : "secondary"} className="text-xs">
            {data.avgResponseTime < 3 ? "Excelente" : "Bom"}
          </Badge>
        </CardContent>
      </Card>

      {/* Session Duration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Duração da Sessão</CardTitle>
            <CardDescription>Média por sessão</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDuration(data.avgSessionDuration)}</div>
          <Badge variant="outline" className="text-xs">
            {data.totalSessions} sessões
          </Badge>
        </CardContent>
      </Card>

      {/* Top Performing Bot */}
      {data.topPerformingBot && (
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Chatbot Mais Ativo</CardTitle>
              <CardDescription>Maior volume de mensagens</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{data.topPerformingBot.name}</div>
            <p className="text-sm text-muted-foreground">{data.topPerformingBot.messages.toLocaleString()} mensagens</p>
          </CardContent>
        </Card>
      )}

      {/* Peak Hour */}
      {data.peakHour && (
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Horário de Pico</CardTitle>
              <CardDescription>Maior atividade do dia</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{data.peakHour.hour}:00h</div>
            <p className="text-sm text-muted-foreground">{data.peakHour.messages.toLocaleString()} mensagens/hora</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
