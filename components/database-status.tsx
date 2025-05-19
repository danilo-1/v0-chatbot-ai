"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"

interface DatabaseStatus {
  status: "connected" | "disconnected" | "error" | "loading"
  database?: {
    url: string
    tables: string[]
    missingTables: string[]
  }
  environment?: string
  versions?: {
    node: string
    prisma: string
  }
  timestamp?: string
  error?: string
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus>({ status: "loading" })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStatus = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch("/api/db-diagnostics")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        status: "error",
        error: error instanceof Error ? error.message : "Failed to fetch database status",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
          {status.status === "connected" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status.status === "disconnected" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {status.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {status.status === "loading" && <RefreshCw className="h-5 w-5 animate-spin" />}
        </CardTitle>
        <CardDescription>
          {status.status === "connected" && "Database is connected and operational"}
          {status.status === "disconnected" && "Database is disconnected"}
          {status.status === "error" && "Error connecting to database"}
          {status.status === "loading" && "Checking database status..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.database && (
          <>
            <div>
              <p className="text-sm font-medium">Connection URL:</p>
              <p className="text-sm text-muted-foreground break-all">{status.database.url}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Tables:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {status.database.tables.map((table) => (
                  <Badge key={table} variant="outline">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>
            {status.database.missingTables.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-500">Missing Tables:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {status.database.missingTables.map((table) => (
                    <Badge key={table} variant="destructive">
                      {table}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {status.versions && (
          <div>
            <p className="text-sm font-medium">Versions:</p>
            <p className="text-sm text-muted-foreground">
              Node.js: {status.versions.node}, Prisma: {status.versions.prisma}
            </p>
          </div>
        )}
        {status.environment && (
          <div>
            <p className="text-sm font-medium">Environment:</p>
            <p className="text-sm text-muted-foreground">{status.environment}</p>
          </div>
        )}
        {status.error && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200">
            <p className="text-sm font-medium text-red-800">Error:</p>
            <p className="text-sm text-red-700">{status.error}</p>
          </div>
        )}
        {status.timestamp && (
          <p className="text-xs text-muted-foreground">Last checked: {new Date(status.timestamp).toLocaleString()}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStatus}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
