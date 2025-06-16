"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartData {
  dailyMessages: Array<{ date: string; messages: number; users: number }>
  hourlyActivity: Array<{ hour: number; messages: number }>
  chatbotUsage: Array<{ name: string; messages: number; color: string }>
  responseTimeDistribution: Array<{ range: string; count: number }>
}

interface AnalyticsChartsProps {
  data: ChartData
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Atividade Diária</CardTitle>
          <CardDescription>Mensagens e usuários únicos por dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyMessages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="messages"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Mensagens"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="users"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Usuários"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade por Hora</CardTitle>
          <CardDescription>Distribuição de mensagens ao longo do dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chatbot Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Chatbot</CardTitle>
          <CardDescription>Distribuição de mensagens entre chatbots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.chatbotUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="messages"
                >
                  {data.chatbotUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Response Time Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribuição do Tempo de Resposta</CardTitle>
          <CardDescription>Frequência de tempos de resposta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.responseTimeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
