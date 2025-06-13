"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error)
    fetch("/api/telemetry/error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        path: window.location.pathname,
      }),
    }).catch((e) => console.error("Telemetry send failed", e))
  }, [error])

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Algo deu errado</CardTitle>
          </div>
          <CardDescription>
            Ocorreu um erro ao carregar o dashboard. Isso pode ser devido a problemas de conexão ou dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-md text-sm">
            <p>Código de erro: {error.digest}</p>
            <p className="mt-2">Tente recarregar a página ou voltar mais tarde.</p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
          </Button>
          <Link href="/">
            <Button variant="outline">Voltar para a página inicial</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
