"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { useTheme } from "next-themes"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - in a real app, this would come from your API
const hourlyData = [
  { hour: "00:00", messages: 42, users: 15 },
  { hour: "01:00", messages: 28, users: 10 },
  { hour: "02:00", messages: 15, users: 6 },
  { hour: "03:00", messages: 8, users: 3 },
  { hour: "04:00", messages: 5, users: 2 },
  { hour: "05:00", messages: 7, users: 3 },
  { hour: "06:00", messages: 12, users: 5 },
  { hour: "07:00", messages: 25, users: 10 },
  { hour: "08:00", messages: 48, users: 18 },
  { hour: "09:00", messages: 68, users: 25 },
  { hour: "10:00", messages: 85, users: 32 },
  { hour: "11:00", messages: 95, users: 38 },
  { hour: "12:00", messages: 102, users: 42 },
  { hour: "13:00", messages: 108, users: 45 },
  { hour: "14:00", messages: 115, users: 48 },
  { hour: "15:00", messages: 120, users: 50 },
  { hour: "16:00", messages: 118, users: 48 },
  { hour: "17:00", messages: 105, users: 42 },
  { hour: "18:00", messages: 92, users: 38 },
  { hour: "19:00", messages: 85, users: 35 },
  { hour: "20:00", messages: 78, users: 32 },
  { hour: "21:00", messages: 68, users: 28 },
  { hour: "22:00", messages: 58, users: 22 },
  { hour: "23:00", messages: 48, users: 18 },
]

const weekdayData = [
  { day: "Monday", messages: 580, users: 220, avgSessionLength: 4.2 },
  { day: "Tuesday", messages: 620, users: 240, avgSessionLength: 4.5 },
  { day: "Wednesday", messages: 650, users: 260, avgSessionLength: 4.3 },
  { day: "Thursday", messages: 680, users: 270, avgSessionLength: 4.6 },
  { day: "Friday", messages: 720, users: 290, avgSessionLength: 4.8 },
  { day: "Saturday", messages: 520, users: 210, avgSessionLength: 3.9 },
  { day: "Sunday", messages: 480, users: 190, avgSessionLength: 3.7 },
]

const topChatbots = [
  { id: 1, name: "Customer Support", messages: 12500, users: 4800, avgResponseTime: 0.6 },
  { id: 2, name: "Product Information", messages: 8700, users: 3200, avgResponseTime: 0.5 },
  { id: 3, name: "Technical Support", messages: 7200, users: 2800, avgResponseTime: 0.8 },
  { id: 4, name: "Sales Assistant", messages: 6500, users: 2400, avgResponseTime: 0.4 },
  { id: 5, name: "FAQ Bot", messages: 5800, users: 2100, avgResponseTime: 0.3 },
]

interface TelemetryChatsProps {
  userId: string
}

export function TelemetryChats({ userId }: TelemetryChatsProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [chatbotFilter, setChatbotFilter] = useState("all")

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select defaultValue="all" onValueChange={setChatbotFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by chatbot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chatbots</SelectItem>
            <SelectItem value="customer">Customer Support</SelectItem>
            <SelectItem value="product">Product Information</SelectItem>
            <SelectItem value="technical">Technical Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Chat Distribution</CardTitle>
          <CardDescription>Messages and users by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="hour" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    color: textColor,
                    border: `1px solid ${gridColor}`,
                  }}
                />
                <Legend />
                <Bar dataKey="messages" fill="#8884d8" name="Messages" />
                <Bar dataKey="users" fill="#82ca9d" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Chat Distribution</CardTitle>
            <CardDescription>Messages by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="day" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      color: textColor,
                      border: `1px solid ${gridColor}`,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="messages" fill="#8884d8" name="Messages" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Length by Day</CardTitle>
            <CardDescription>Average number of messages per session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekdayData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="day" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      color: textColor,
                      border: `1px solid ${gridColor}`,
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="avgSessionLength" stroke="#8884d8" name="Avg. Messages per Session" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Chatbots</CardTitle>
          <CardDescription>Chatbots with the most engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chatbot</TableHead>
                <TableHead className="text-right">Messages</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Avg. Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topChatbots.map((chatbot) => (
                <TableRow key={chatbot.id}>
                  <TableCell className="font-medium">{chatbot.name}</TableCell>
                  <TableCell className="text-right">{chatbot.messages.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{chatbot.users.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{chatbot.avgResponseTime}s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
