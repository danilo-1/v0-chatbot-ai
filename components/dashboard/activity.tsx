"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Users, Clock, TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ActivityItem {
  id: string
  type: "message" | "user" | "chatbot_created" | "performance"
  title: string
  description: string
  timestamp: Date
  chatbotId?: string
  chatbotName?: string
  userId?: string
  userName?: string
  metadata?: Record<string, any>
}

interface ActivityProps {
  limit?: number
  showHeader?: boolean
  className?: string
}

export function Activity({ limit = 10, showHeader = true, className }: ActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [limit])

  const fetchActivities = async () => {
    try {
      setLoading(true)

      // Simular dados de atividade (em produção, isso viria de uma API)
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "message",
          title: "Nova conversa iniciada",
          description: "Usuário iniciou conversa com ChatBot Suporte",
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
          chatbotId: "1",
          chatbotName: "ChatBot Suporte",
          userId: "user1",
          userName: "João Silva",
        },
        {
          id: "2",
          type: "user",
          title: "Novo usuário registrado",
          description: "Maria Santos se registrou na plataforma",
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
          userId: "user2",
          userName: "Maria Santos",
        },
        {
          id: "3",
          type: "chatbot_created",
          title: "Chatbot criado",
          description: "ChatBot Vendas foi criado com sucesso",
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
          chatbotId: "2",
          chatbotName: "ChatBot Vendas",
        },
        {
          id: "4",
          type: "performance",
          title: "Pico de atividade",
          description: "ChatBot Suporte processou 50+ mensagens na última hora",
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min atrás
          chatbotId: "1",
          chatbotName: "ChatBot Suporte",
          metadata: { messageCount: 52 },
        },
        {
          id: "5",
          type: "message",
          title: "Conversa finalizada",
          description: "Sessão de 15 minutos finalizada com sucesso",
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
          chatbotId: "1",
          chatbotName: "ChatBot Suporte",
          metadata: { duration: 15 },
        },
        {
          id: "6",
          type: "user",
          title: "Usuário ativo",
          description: "Pedro Costa retornou após 7 dias",
          timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 horas atrás
          userId: "user3",
          userName: "Pedro Costa",
        },
        {
          id: "7",
          type: "performance",
          title: "Tempo de resposta otimizado",
          description: "ChatBot Vendas melhorou tempo médio para 1.2s",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          chatbotId: "2",
          chatbotName: "ChatBot Vendas",
          metadata: { responseTime: 1.2 },
        },
        {
          id: "8",
          type: "message",
          title: "Múltiplas conversas",
          description: "ChatBot Suporte gerenciou 5 conversas simultâneas",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
          chatbotId: "1",
          chatbotName: "ChatBot Suporte",
          metadata: { concurrentChats: 5 },
        },
      ]

      setActivities(mockActivities.slice(0, limit))
    } catch (error) {
      console.error("Erro ao buscar atividades:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      case "chatbot_created":
        return <TrendingUp className="h-4 w-4" />
      case "performance":
        return <Clock className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "message":
        return "bg-blue-500"
      case "user":
        return "bg-green-500"
      case "chatbot_created":
        return "bg-purple-500"
      case "performance":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getBadgeVariant = (type: ActivityItem["type"]) => {
    switch (type) {
      case "message":
        return "default" as const
      case "user":
        return "secondary" as const
      case "chatbot_created":
        return "outline" as const
      case "performance":
        return "destructive" as const
      default:
        return "default" as const
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atividades dos seus chatbots</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas atividades dos seus chatbots</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade recente</p>
                <p className="text-sm">As atividades aparecerão aqui quando você começar a usar seus chatbots</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)} text-white`}>
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                      <Badge variant={getBadgeVariant(activity.type)} className="ml-2 text-xs">
                        {activity.type === "message" && "Mensagem"}
                        {activity.type === "user" && "Usuário"}
                        {activity.type === "chatbot_created" && "Criação"}
                        {activity.type === "performance" && "Performance"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {activity.chatbotName && (
                          <span className="bg-muted px-2 py-1 rounded">{activity.chatbotName}</span>
                        )}
                        {activity.userName && <span className="bg-muted px-2 py-1 rounded">{activity.userName}</span>}
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
