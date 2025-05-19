"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { useTheme } from "next-themes"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data - in a real app, this would come from your API
const responseTimeData = [
  { date: "2023-01-01", avg: 0.8, p50: 0.7, p90: 1.2, p99: 2.1 },
  { date: "2023-01-02", avg: 0.7, p50: 0.6, p90: 1.1, p99: 1.9 },
  { date: "2023-01-03", avg: 0.9, p50: 0.8, p90: 1.3, p99: 2.2 },
  { date: "2023-01-04", avg: 0.6, p50: 0.5, p90: 1.0, p99: 1.8 },
  { date: "2023-01-05", avg: 0.7, p50: 0.6, p90: 1.1, p99: 2.0 },
  { date: "2023-01-06", avg: 0.5, p50: 0.4, p90: 0.9, p99: 1.7 },
  { date: "2023-01-07", avg: 0.6, p50: 0.5, p90: 1.0, p99: 1.8 },
]

const errorRateData = [
  { date: "2023-01-01", rate: 2.1 },
  { date: "2023-01-02", rate: 1.8 },
  { date: "2023-01-03", rate: 2.3 },
  { date: "2023-01-04", rate: 1.5 },
  { date: "2023-01-05", rate: 1.9 },
  { date: "2023-01-06", rate: 1.2 },
  { date: "2023-01-07", rate: 1.6 },
]

const tokenUsageData = [
  { date: "2023-01-01", prompt: 12500, completion: 8700 },
  { date: "2023-01-02", prompt: 13200, completion: 9100 },
  { date: "2023-01-03", prompt: 14800, completion: 10200 },
  { date: "2023-01-04", prompt: 11900, completion: 8200 },
  { date: "2023-01-05", prompt: 13500, completion: 9300 },
  { date: "2023-01-06", prompt: 12800, completion: 8800 },
  { date: "2023-01-07", prompt: 13100, completion: 9000 },
]

const errorLogData = [
  {
    id: 1,
    timestamp: "2023-01-07 14:32:15",
    chatbotId: "cs-bot-1",
    type: "API Timeout",
    message: "OpenAI API request timed out after 10s",
  },
  {
    id: 2,
    timestamp: "2023-01-07 12:18:42",
    chatbotId: "product-bot",
    type: "Rate Limit",
    message: "Rate limit exceeded for requests per minute",
  },
  {
    id: 3,
    timestamp: "2023-01-07 09:45:23",
    chatbotId: "tech-support",
    type: "Context Length",
    message: "Maximum context length exceeded",
  },
  {
    id: 4,
    timestamp: "2023-01-06 22:12:56",
    chatbotId: "sales-bot",
    type: "API Error",
    message: "OpenAI API returned error 500",
  },
  {
    id: 5,
    timestamp: "2023-01-06 18:37:09",
    chatbotId: "cs-bot-2",
    type: "Validation",
    message: "Invalid prompt format",
  },
]

interface TelemetryPerformanceProps {
  userId: string
}

export function TelemetryPerformance({ userId }: TelemetryPerformanceProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [timeRange, setTimeRange] = useState("7days")

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select defaultValue="7days" onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hours">Last 24 hours</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
          <CardDescription>Average and percentile response times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    color: textColor,
                    border: `1px solid ${gridColor}`,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="avg" stroke="#8884d8" name="Average" />
                <Line type="monotone" dataKey="p50" stroke="#82ca9d" name="p50" />
                <Line type="monotone" dataKey="p90" stroke="#ffc658" name="p90" />
                <Line type="monotone" dataKey="p99" stroke="#ff8042" name="p99" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>Percentage of requests resulting in errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorRateData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      color: textColor,
                      border: `1px solid ${gridColor}`,
                    }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#ff8042" fill="#ff8042" name="Error Rate (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Usage</CardTitle>
            <CardDescription>Prompt and completion tokens used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tokenUsageData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      color: textColor,
                      border: `1px solid ${gridColor}`,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="prompt" stackId="a" fill="#8884d8" name="Prompt Tokens" />
                  <Bar dataKey="completion" stackId="a" fill="#82ca9d" name="Completion Tokens" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Error Logs</CardTitle>
          <CardDescription>Recent errors and exceptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Chatbot</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorLogData.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>{log.chatbotId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
