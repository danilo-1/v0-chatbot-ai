"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Database } from "lucide-react"

export default function PrismaTestPage() {
  const [testData, setTestData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTest = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/prisma-test")
      const data = await response.json()
      setTestData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Database className="h-6 w-6" /> Prisma Connection Test
          </CardTitle>
          <CardDescription>Test the connection to your database using Prisma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={runTest} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Run Test
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {testData?.error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Test Error</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>{testData.error}</p>
                  {testData.stack && (
                    <details>
                      <summary className="cursor-pointer text-sm">Stack Trace</summary>
                      <pre className="text-xs mt-2 p-2 bg-gray-800 text-white rounded overflow-auto">
                        {testData.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {testData?.success && (
            <div className="space-y-6">
              <Alert variant="default">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Connection Successful</AlertTitle>
                <AlertDescription>Connected to the database in {testData.latency}</AlertDescription>
              </Alert>

              {/* Database Version */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Database Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Version</p>
                      <p className="text-sm">{testData.result[0]?.version?.split(" ")[0] || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Server Time</p>
                      <p className="text-sm">
                        {testData.result[0]?.time ? new Date(testData.result[0].time).toLocaleString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tables */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Database Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(testData.tables) && testData.tables.length > 0 ? (
                    <div className="overflow-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Table Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Columns
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {testData.tables.map((table: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {table.table_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {table.column_count}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No tables found in the database.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
