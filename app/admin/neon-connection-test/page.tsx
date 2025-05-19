"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function NeonConnectionTestPage() {
  const [testData, setTestData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/neon-connection-test")
      const data = await response.json()
      setTestData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Neon Connection Tests</CardTitle>
          <CardDescription>Testing different methods to connect to Neon database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={runTests} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Run Tests
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
              <AlertDescription>{testData.error}</AlertDescription>
            </Alert>
          )}

          {testData && (
            <div className="space-y-4">
              {/* Direct Neon Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Direct Neon Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.tests?.directNeon?.status === "success" ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Success (Latency: {testData.tests.directNeon.latency}ms)
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {testData.tests?.directNeon?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pool Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connection Pool</CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.tests?.pool?.status === "success" ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Success (Latency: {testData.tests.pool.latency}ms)
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {testData.tests?.pool?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prisma Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prisma Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.tests?.prisma?.status === "success" ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Success (Latency: {testData.tests.prisma.latency}ms)
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {testData.tests?.prisma?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modified URL Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Modified URL Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.tests?.modifiedUrl?.status === "success" ? (
                    <div>
                      <div className="flex items-center text-green-500 mb-2">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Success (Latency: {testData.tests.modifiedUrl.latency}ms)
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Modifications:</p>
                        <ul className="list-disc list-inside">
                          {testData.tests.modifiedUrl.modifications.map((mod: string, index: number) => (
                            <li key={index}>{mod}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {testData.tests?.modifiedUrl?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* No SSL Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SSL Disabled Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.tests?.noSsl?.status === "success" ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Success (Latency: {testData.tests.noSsl.latency}ms)
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      Failed: {testData.tests?.noSsl?.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timestamp */}
              <div className="text-sm text-gray-500 text-right">
                Tests run at: {new Date(testData.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
