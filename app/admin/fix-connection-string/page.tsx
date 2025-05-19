"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Copy } from "lucide-react"

export default function FixConnectionStringPage() {
  const [connectionData, setConnectionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const analyzeConnectionString = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/fix-connection-string")
      const data = await response.json()
      setConnectionData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(name)
        setTimeout(() => setCopied(null), 2000)
      },
      () => {
        setError("Failed to copy to clipboard")
      },
    )
  }

  useEffect(() => {
    analyzeConnectionString()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Database Connection String Analysis</CardTitle>
          <CardDescription>Analyze and fix your Neon database connection string</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={analyzeConnectionString} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Analyze Connection String
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

          {connectionData?.error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{connectionData.error}</AlertDescription>
            </Alert>
          )}

          {connectionData?.success && (
            <div className="space-y-6">
              {/* Current Connection String */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Connection String</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm break-all">
                    {connectionData.currentUrl}
                  </div>
                </CardContent>
              </Card>

              {/* Connection Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connection Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Host</p>
                      <p className="text-sm">{connectionData.analysis.host}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Port</p>
                      <p className="text-sm">{connectionData.analysis.port}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Database</p>
                      <p className="text-sm">{connectionData.analysis.database}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">SSL Mode</p>
                      <p className="text-sm">
                        {connectionData.analysis.hasSslMode
                          ? connectionData.analysis.sslModeValue
                          : "Not specified (defaults to require)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pooled</p>
                      <p className="text-sm">
                        {connectionData.analysis.hasPooled ? connectionData.analysis.pooledValue : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Connection Limit</p>
                      <p className="text-sm">
                        {connectionData.analysis.hasConnectionLimit
                          ? connectionData.analysis.connectionLimitValue
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Connection Strings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Connection Strings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {connectionData.suggestions.map((suggestion: any, index: number) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base">{suggestion.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm break-all relative">
                              {suggestion.url}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(suggestion.url, suggestion.name)}
                              >
                                {copied === suggestion.name ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Changes:</p>
                              <ul className="list-disc list-inside text-sm">
                                {suggestion.changes.map((change: string, i: number) => (
                                  <li key={i}>{change}</li>
                                ))}
                              </ul>
                            </div>
                            {suggestion.warning && (
                              <Alert variant="warning">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>{suggestion.warning}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
