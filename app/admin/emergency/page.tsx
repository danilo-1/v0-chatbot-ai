"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Server } from "lucide-react"

export default function EmergencyPage() {
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null)
  const [setupData, setSetupData] = useState<any>(null)
  const [loading, setLoading] = useState<{ diagnostics: boolean; setup: boolean }>({
    diagnostics: false,
    setup: false,
  })
  const [error, setError] = useState<{ diagnostics: string | null; setup: string | null }>({
    diagnostics: null,
    setup: null,
  })

  const runDiagnostics = async () => {
    setLoading((prev) => ({ ...prev, diagnostics: true }))
    setError((prev) => ({ ...prev, diagnostics: null }))

    try {
      const response = await fetch("/api/db-setup/emergency")
      const data = await response.json()
      setDiagnosticsData(data)
    } catch (err) {
      setError((prev) => ({ ...prev, diagnostics: err instanceof Error ? err.message : String(err) }))
    } finally {
      setLoading((prev) => ({ ...prev, diagnostics: false }))
    }
  }

  const runSetup = async () => {
    setLoading((prev) => ({ ...prev, setup: true }))
    setError((prev) => ({ ...prev, setup: null }))

    try {
      const response = await fetch("/api/db-setup/emergency", {
        method: "POST",
      })
      const data = await response.json()
      setSetupData(data)
    } catch (err) {
      setError((prev) => ({ ...prev, setup: err instanceof Error ? err.message : String(err) }))
    } finally {
      setLoading((prev) => ({ ...prev, setup: false }))
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Database className="h-6 w-6" /> Database Emergency Tools
          </CardTitle>
          <CardDescription>Use these tools to diagnose and fix database connection issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Emergency Use Only</AlertTitle>
            <AlertDescription>
              These tools are for emergency use only. They can modify your database schema and data.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="diagnostics">
            <TabsList className="mb-4">
              <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
              <TabsTrigger value="setup">Database Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="diagnostics">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Database Connection Diagnostics</h3>
                  <Button variant="outline" size="sm" onClick={runDiagnostics} disabled={loading.diagnostics}>
                    {loading.diagnostics ? (
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

                {error.diagnostics && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.diagnostics}</AlertDescription>
                  </Alert>
                )}

                {diagnosticsData && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Direct Connection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {diagnosticsData.directConnection?.error ? (
                            <div className="flex items-center text-red-500">
                              <XCircle className="mr-2 h-5 w-5" />
                              Failed
                            </div>
                          ) : (
                            <div className="flex items-center text-green-500">
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Success
                            </div>
                          )}
                        </CardContent>
                        {diagnosticsData.directConnection?.error && (
                          <CardFooter className="text-sm text-red-500 border-t pt-4">
                            {diagnosticsData.directConnection.error}
                          </CardFooter>
                        )}
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Pool Connection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {diagnosticsData.poolConnection?.error ? (
                            <div className="flex items-center text-red-500">
                              <XCircle className="mr-2 h-5 w-5" />
                              Failed
                            </div>
                          ) : (
                            <div className="flex items-center text-green-500">
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Success
                            </div>
                          )}
                        </CardContent>
                        {diagnosticsData.poolConnection?.error && (
                          <CardFooter className="text-sm text-red-500 border-t pt-4">
                            {diagnosticsData.poolConnection.error}
                          </CardFooter>
                        )}
                      </Card>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Environment Information</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(diagnosticsData.environment, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="setup">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Database Setup</h3>
                  <Button variant="outline" size="sm" onClick={runSetup} disabled={loading.setup}>
                    {loading.setup ? (
                      <>
                        <Server className="mr-2 h-4 w-4 animate-pulse" /> Running...
                      </>
                    ) : (
                      <>
                        <Server className="mr-2 h-4 w-4" /> Run Setup
                      </>
                    )}
                  </Button>
                </div>

                {error.setup && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.setup}</AlertDescription>
                  </Alert>
                )}

                {setupData && (
                  <div className="space-y-4">
                    <Alert variant={setupData.success ? "default" : "destructive"}>
                      {setupData.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <AlertTitle>{setupData.success ? "Success" : "Error"}</AlertTitle>
                      <AlertDescription>{setupData.message || setupData.error}</AlertDescription>
                    </Alert>

                    {setupData.tables && (
                      <div>
                        <h4 className="font-medium mb-2">Database Tables</h4>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                          <ul className="list-disc list-inside">
                            {setupData.tables.map((table: string) => (
                              <li key={table}>{table}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {setupData.test && (
                      <div>
                        <h4 className="font-medium mb-2">Connection Test</h4>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                          <pre className="text-xs overflow-auto">{JSON.stringify(setupData.test, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
