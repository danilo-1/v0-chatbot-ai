"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Sample data - in a real app, this would come from your API
const weeklyData = [
  { name: "Mon", messages: 120, users: 24 },
  { name: "Tue", messages: 160, users: 28 },
  { name: "Wed", messages: 180, users: 32 },
  { name: "Thu", messages: 190, users: 36 },
  { name: "Fri", messages: 170, users: 30 },
  { name: "Sat", messages: 110, users: 22 },
  { name: "Sun", messages: 90, users: 18 },
]

const monthlyData = [
  { name: "Jan", messages: 1200, users: 240 },
  { name: "Feb", messages: 1900, users: 320 },
  { name: "Mar", messages: 2100, users: 380 },
  { name: "Apr", messages: 2400, users: 420 },
  { name: "May", messages: 2200, users: 400 },
  { name: "Jun", messages: 2600, users: 460 },
]

const chatbotUsageData = [
  { name: "Customer Support", value: 45 },
  { name: "Product Info", value: 30 },
  { name: "FAQ", value: 15 },
  { name: "Other", value: 10 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]

export function DashboardCharts() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Message Activity</CardTitle>
          <CardDescription>Number of messages and unique users over time</CardDescription>
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={textColor} />
                    <YAxis stroke={textColor} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        color: textColor,
                        border: `1px solid ${gridColor}`,
                      }}
                    />
                    <Line type="monotone" dataKey="messages" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="users" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="monthly" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={textColor} />
                    <YAxis stroke={textColor} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        color: textColor,
                        border: `1px solid ${gridColor}`,
                      }}
                    />
                    <Line type="monotone" dataKey="messages" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="users" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chatbot Usage Distribution</CardTitle>
          <CardDescription>Types of chatbots used by your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chatbotUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chatbotUsageData.map((entry, index) => (
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
    </>
  )
}
