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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useTheme } from "next-themes"

// Sample data - in a real app, this would come from your API
const overviewData = [
  { date: "2023-01", messages: 1200, users: 240, responseTime: 0.8, satisfaction: 4.2 },
  { date: "2023-02", messages: 1900, users: 320, responseTime: 0.7, satisfaction: 4.3 },
  { date: "2023-03", messages: 2100, users: 380, responseTime: 0.9, satisfaction: 4.1 },
  { date: "2023-04", messages: 2400, users: 420, responseTime: 0.6, satisfaction: 4.4 },
  { date: "2023-05", messages: 2200, users: 400, responseTime: 0.7, satisfaction: 4.3 },
  { date: "2023-06", messages: 2600, users: 460, responseTime: 0.5, satisfaction: 4.5 },
  { date: "2023-07", messages: 2800, users: 480, responseTime: 0.6, satisfaction: 4.4 },
  { date: "2023-08", messages: 3000, users: 520, responseTime: 0.5, satisfaction: 4.6 },
  { date: "2023-09", messages: 3200, users: 560, responseTime: 0.4, satisfaction: 4.7 },
  { date: "2023-10", messages: 3400, users: 600, responseTime: 0.5, satisfaction: 4.6 },
  { date: "2023-11", messages: 3600, users: 640, responseTime: 0.4, satisfaction: 4.8 },
  { date: "2023-12", messages: 3800, users: 680, responseTime: 0.3, satisfaction: 4.9 },
]

const topicDistribution = [
  { name: "Product Questions", value: 35 },
  { name: "Technical Support", value: 25 },
  { name: "Pricing", value: 15 },
  { name: "Shipping", value: 10 },
  { name: "Returns", value: 15 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]

interface TelemetryOverviewProps {
  userId: string
}

export function TelemetryOverview({ userId }: TelemetryOverviewProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [timeRange, setTimeRange] = useState("year")

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  // Filter data based on time range
  const filteredData =
    timeRange === "year" ? overviewData : timeRange === "quarter" ? overviewData.slice(-3) : overviewData.slice(-1)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select defaultValue="year" onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Last 12 months</SelectItem>
            <SelectItem value="quarter">Last 3 months</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.reduce((sum, item) => sum + item.messages, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.reduce((sum, item) => sum + item.users, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(filteredData.reduce((sum, item) => sum + item.responseTime, 0) / filteredData.length).toFixed(2)}s
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(filteredData.reduce((sum, item) => sum + item.satisfaction, 0) / filteredData.length).toFixed(1)}/5
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Message Volume Trend</CardTitle>
            <CardDescription>Number of messages over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                  <Line type="monotone" dataKey="messages" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Distribution</CardTitle>
            <CardDescription>What users are asking about</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {topicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      color: textColor,
                      border: `1px solid ${gridColor}`,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Response time and user satisfaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} />
                <YAxis yAxisId="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    color: textColor,
                    border: `1px solid ${gridColor}`,
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#8884d8" name="Response Time (s)" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#82ca9d"
                  name="Satisfaction (1-5)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
