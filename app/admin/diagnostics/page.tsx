import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { DatabaseStatus } from "@/components/database-status"

export const metadata: Metadata = {
  title: "System Diagnostics",
  description: "System diagnostics and troubleshooting",
}

async function DiagnosticsContent() {
  const session = await getServerSession(authOptions)

  // Only allow admin access
  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  // Test database connection
  let dbStatus = { status: "error", message: "Unknown error" }
  try {
    const result = await sql`SELECT NOW() as time`
    dbStatus = {
      status: "success",
      message: `Connected successfully. Server time: ${result[0].time}`,
    }
  } catch (error) {
    dbStatus = {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    }
  }

  // Get environment variables status
  const envVars = [
    { name: "DATABASE_URL", value: process.env.DATABASE_URL ? "set" : "not set" },
    { name: "NEXTAUTH_URL", value: process.env.NEXTAUTH_URL ? "set" : "not set" },
    { name: "NEXTAUTH_SECRET", value: process.env.NEXTAUTH_SECRET ? "set" : "not set" },
    { name: "GOOGLE_CLIENT_ID", value: process.env.GOOGLE_CLIENT_ID ? "set" : "not set" },
    { name: "GOOGLE_CLIENT_SECRET", value: process.env.GOOGLE_CLIENT_SECRET ? "set" : "not set" },
    { name: "OPENAI_API_KEY", value: process.env.OPENAI_API_KEY ? "set" : "not set" },
  ]

  // Get database tables
  let tables = []
  try {
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    tables = tablesResult.map((row) => row.table_name)
  } catch (error) {
    console.error("Error fetching tables:", error)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
          <CardDescription>Detailed information about the system status</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-2">Database Connection</h3>
          <Alert variant={dbStatus.status === "success" ? "default" : "destructive"}>
            {dbStatus.status === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{dbStatus.status === "success" ? "Connected" : "Connection Error"}</AlertTitle>
            <AlertDescription>{dbStatus.message}</AlertDescription>
          </Alert>

          <h3 className="text-lg font-medium mt-6 mb-2">Environment Variables</h3>
          <div className="space-y-2">
            {envVars.map((env) => (
              <Alert key={env.name} variant={env.value === "set" ? "default" : "destructive"}>
                {env.value === "set" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{env.name}</AlertTitle>
                <AlertDescription>{env.value}</AlertDescription>
              </Alert>
            ))}
          </div>

          <h3 className="text-lg font-medium mt-6 mb-2">Database Tables</h3>
          {tables.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {tables.map((table) => (
                <li key={table}>{table}</li>
              ))}
            </ul>
          ) : (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No tables found</AlertTitle>
              <AlertDescription>
                Could not retrieve database tables. This may indicate a connection issue.
              </AlertDescription>
            </Alert>
          )}

          <h3 className="text-lg font-medium mt-6 mb-2">Authentication</h3>
          <Alert variant={session ? "default" : "warning"}>
            {session ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertTitle>{session ? "Authenticated" : "Not Authenticated"}</AlertTitle>
            <AlertDescription>
              {session ? (
                <div>
                  Logged in as {session.user?.name} ({session.user?.email})
                  <div className="text-sm text-muted-foreground">Role: {session.user?.role || "unknown"}</div>
                </div>
              ) : (
                "No active session found"
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>

      <div className="grid gap-6">
        <Suspense fallback={<div>Loading diagnostics...</div>}>
          <DiagnosticsContent />
        </Suspense>
        <DatabaseStatus />
      </div>
    </div>
  )
}
