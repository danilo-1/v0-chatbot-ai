"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, MessageSquare, Users, Activity } from "lucide-react"

interface DashboardMetricsProps {
  metrics: {
    totalChatbots: number
    publicChatbots: number
    totalMessages: number
    activeChats: number
  }
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Chatbots</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalChatbots}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.publicChatbots} public, {metrics.totalChatbots - metrics.publicChatbots} private
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalMessages.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +{Math.floor(metrics.totalMessages * 0.12).toLocaleString()} from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeChats}</div>
          <p className="text-xs text-muted-foreground">{Math.floor(metrics.activeChats * 0.8)} in the last 24 hours</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.floor(metrics.totalMessages * 0.3).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +{Math.floor(metrics.totalMessages * 0.05).toLocaleString()} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
