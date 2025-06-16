"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Code, Database } from "lucide-react"

// Importação dinâmica do SwaggerUI para evitar problemas de SSR
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false })

export default function DocsPage() {
  const [spec, setSpec] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => {
        setSpec(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erro ao carregar especificação:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">API Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Documentação completa da API do Chatbot AI. Explore todos os endpoints disponíveis, teste as funcionalidades e
          integre com sua aplicação.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">OpenAPI 3.0</Badge>
          <Badge variant="secondary">REST API</Badge>
          <Badge variant="secondary">JSON</Badge>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Endpoints
            </CardTitle>
            <CardDescription>Explore todos os endpoints disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Chatbots</span>
                <Badge variant="outline">12 endpoints</Badge>
              </div>
              <div className="flex justify-between">
                <span>Autenticação</span>
                <Badge variant="outline">4 endpoints</Badge>
              </div>
              <div className="flex justify-between">
                <span>Admin</span>
                <Badge variant="outline">8 endpoints</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Modelos
            </CardTitle>
            <CardDescription>Estruturas de dados utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>User</span>
                <Badge variant="outline">Schema</Badge>
              </div>
              <div className="flex justify-between">
                <span>Chatbot</span>
                <Badge variant="outline">Schema</Badge>
              </div>
              <div className="flex justify-between">
                <span>Message</span>
                <Badge variant="outline">Schema</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recursos
            </CardTitle>
            <CardDescription>Links úteis e recursos adicionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <a href="/api/docs" target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                JSON Spec
              </a>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <a href="/dashboard" target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Swagger UI */}
      <Card>
        <CardHeader>
          <CardTitle>API Explorer</CardTitle>
          <CardDescription>Interface interativa para testar os endpoints da API</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {spec && (
            <div className="swagger-container">
              <SwaggerUI
                spec={spec}
                docExpansion="list"
                defaultModelsExpandDepth={2}
                defaultModelExpandDepth={2}
                displayRequestDuration={true}
                tryItOutEnabled={true}
                filter={true}
                showExtensions={true}
                showCommonExtensions={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx global>{`
        .swagger-container .swagger-ui {
          font-family: inherit;
        }
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui .info {
          margin: 20px 0;
        }
        .swagger-ui .scheme-container {
          background: transparent;
          box-shadow: none;
          padding: 0;
        }
      `}</style>
    </div>
  )
}
