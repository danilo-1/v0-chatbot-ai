"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Clock } from "lucide-react"

export default function NeonDiagnosticsPage() {
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/neon-diagnostics")
      const data = await response.json()
      setDiagnosticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch (e) {
      return timestamp
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Database className="h-6 w-6" /> Neon Database Diagnostics
          </CardTitle>
          <CardDescription>Detailed diagnostics for your Neon database connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={runDiagnostics} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Run Diagnostics
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

          {diagnosticsData?.error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Diagnostics Error</AlertTitle>
              <AlertDescription>{diagnosticsData.error}</AlertDescription>
            </Alert>
          )}

          {diagnosticsData && (
            <div className="space-y-6">
              {/* Environment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Node Version</p>
                      <p className="text-sm">{diagnosticsData.environment?.node || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Runtime</p>
                      <p className="text-sm">{diagnosticsData.environment?.runtime || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Region</p>
                      <p className="text-sm">{diagnosticsData.environment?.region || "Unknown"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connection Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connection Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticsData.connectionInfo?.error ? (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{diagnosticsData.connectionInfo.error}</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Host</p>
                        <p className="text-sm">{diagnosticsData.connectionInfo?.host || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Port</p>
                        <p className="text-sm">{diagnosticsData.connectionInfo?.port || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Database</p>
                        <p className="text-sm">{diagnosticsData.connectionInfo?.database || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">SSL</p>
                        <p className="text-sm">{diagnosticsData.connectionInfo?.ssl ? "Enabled" : "Disabled"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium">Connection String (masked)</p>
                        <p className="text-sm font-mono break-all">
                          {diagnosticsData.connectionInfo?.masked_url || "Unknown"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Direct Neon Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Direct Neon Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticsData.tests?.directNeon?.status === "success" ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Success
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Latency</p>
                          <p className="text-sm">{diagnosticsData.tests.directNeon.latency}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Test Result</p>
                          <p className="text-sm">{diagnosticsData.tests.directNeon.result?.test}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Database Version</p>
                          <p className="text-sm">{diagnosticsData.tests.directNeon.result?.version?.split(" ")[0]}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {diagnosticsData.tests?.directNeon?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Connection Pool Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connection Pool</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticsData.tests?.connectionPool?.status === "success" ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Success
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Latency</p>
                          <p className="text-sm">{diagnosticsData.tests.connectionPool.latency}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Test Result</p>
                          <p className="text-sm">{diagnosticsData.tests.connectionPool.result?.test}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Database</p>
                          <p className="text-sm">{diagnosticsData.tests.connectionPool.result?.database}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {diagnosticsData.tests?.connectionPool?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tables Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Database Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticsData.tests?.tables?.status === "success" ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Success: {diagnosticsData.tests.tables.count} tables found
                      </div>
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
                            {diagnosticsData.tests.tables.tables.map((table: any) => (
                              <tr key={table.name}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {table.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.columns}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {diagnosticsData.tests?.tables?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Network Latency Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticsData.tests?.networkLatency?.status === "success" ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5" />
                        Average: {Math.round(diagnosticsData.tests.networkLatency.average)}ms
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {diagnosticsData.tests.networkLatency.tests.map((test: number, index: number) => (
                          <div key={index}>
                            <p className="text-sm font-medium">Test {index + 1}</p>
                            <p className="text-sm">{test}ms</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {diagnosticsData.tests?.networkLatency?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SSL Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SSL Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticsData.tests?.ssl?.status === "success" ? (
                    <div className="flex items-center">
                      {diagnosticsData.tests.ssl.enabled ? (
                        <div className="flex items-center text-green-500">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          SSL is enabled
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-500">
                          <AlertTriangle className="mr-2 h-5 w-5" />
                          SSL is disabled
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {diagnosticsData.tests?.ssl?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timestamp */}
              <div className="text-sm text-gray-500 text-right">
                Diagnostics run at: {formatTime(diagnosticsData.timestamp)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
