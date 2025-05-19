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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useTheme } from "next-themes"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - in a real app, this would come from your API
const userRetentionData = [
  { month: "Jan", newUsers: 120, returningUsers: 0 },
  { month: "Feb", newUsers: 150, returningUsers: 60 },
  { month: "Mar", newUsers: 180, returningUsers: 90 },
  { month: "Apr", newUsers: 210, returningUsers: 120 },
  { month: "May", newUsers: 240, returningUsers: 150 },
  { month: "Jun", newUsers: 270, returningUsers: 180 },
]

const userSatisfactionData = [
  { rating: "1 Star", count: 15 },
  { rating: "2 Stars", count: 30 },
  { rating: "3 Stars", count: 120 },
  { rating: "4 Stars", count: 280 },
  { rating: "5 Stars", count: 420 },
]

const userDeviceData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 40 },
  { name: "Tablet", value: 15 },
]

const userLocationData = [
  { country: "United States", users: 2500, percentage: "42%" },
  { country: "United Kingdom", users: 850, percentage: "14%" },
  { country: "Canada", users: 620, percentage: "10%" },
  { country: "Australia", users: 480, percentage: "8%" },
  { country: "Germany", users: 420, percentage: "7%" },
  { country: "France", users: 380, percentage: "6%" },
  { country: "Other", users: 750, percentage: "13%" },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]

interface TelemetryUsersProps {
  userId: string
}

export function TelemetryUsers({ userId }: TelemetryUsersProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [timeRange, setTimeRange] = useState("6months")

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select defaultValue="6months" onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Retention</CardTitle>
          <CardDescription>New vs returning users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userRetentionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    color: textColor,
                    border: `1px solid ${gridColor}`,
                  }}
                />
                <Legend />
                <Bar dataKey="newUsers" stackId="a" fill="#8884d8" name="New Users" />
                <Bar dataKey="returningUsers" stackId="a" fill="#82ca9d" name="Returning Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
            <CardDescription>Distribution of user ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userSatisfactionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="rating" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      color: textColor,
                      border: `1px solid ${gridColor}`,
                    }}
                  />
                  <Bar dataKey="count" fill="#8884d8" name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Devices</CardTitle>
            <CardDescription>Types of devices used to access chatbots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDeviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDeviceData.map((entry, index) => (
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
          <CardTitle>User Locations</CardTitle>
          <CardDescription>Geographic distribution of users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLocationData.map((location) => (
                <TableRow key={location.country}>
                  <TableCell className="font-medium">{location.country}</TableCell>
                  <TableCell className="text-right">{location.users.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{location.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
