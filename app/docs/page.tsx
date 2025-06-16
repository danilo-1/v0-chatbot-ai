"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Code, Database, Shield, Zap, ExternalLink } from "lucide-react"
import { EndpointCard } from "@/components/docs/endpoint-card"
import { CodeBlock } from "@/components/docs/code-block"
import { apiEndpoints, apiTags } from "@/lib/api-docs"

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredEndpoints = apiEndpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = !selectedTag || endpoint.tags.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  const quickStartCode = `// Instalar dependências
npm install axios

// Exemplo de uso básico
import axios from 'axios'

const api = axios.create({
  baseURL: '${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Listar chatbots
const chatbots = await api.get('/chatbots')

// Conversar com um chatbot
const response = await api.post('/chatbots/chatbot_123/chat', {
  message: 'Olá!',
  sessionId: 'session_456'
})`

  const authCode = `// Autenticação com Session (Browser)
// A autenticação é automática via cookies de sessão

// Autenticação com Bearer Token (API)
const api = axios.create({
  baseURL: '${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
})`

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">API Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Documentação completa da API do Chatbot AI. Integre facilmente chatbots inteligentes em suas aplicações.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">REST API</Badge>
          <Badge variant="secondary">JSON</Badge>
          <Badge variant="secondary">OpenAPI 3.0</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="quickstart">Início Rápido</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">Autenticação</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5 text-blue-500" />
                  Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apiEndpoints.length}</div>
                <p className="text-sm text-muted-foreground">Total de endpoints</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5 text-green-500" />
                  Recursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apiTags.length}</div>
                <p className="text-sm text-muted-foreground">Categorias de API</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">OAuth 2.0</div>
                <p className="text-sm text-muted-foreground">Autenticação segura</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime garantido</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos Principais</CardTitle>
                <CardDescription>Funcionalidades disponíveis na API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Gerenciamento completo de chatbots</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Chat em tempo real com IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Múltiplos modelos de IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Analytics e insights</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Links Úteis</CardTitle>
                <CardDescription>Recursos adicionais para desenvolvedores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/dashboard" target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Dashboard
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/api/docs" target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    OpenAPI Spec
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com" target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quick Start */}
        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Início Rápido</CardTitle>
              <CardDescription>Comece a usar a API em poucos minutos</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={quickStartCode} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints */}
        <TabsContent value="endpoints" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                Todos
              </Button>
              {apiTags.map((tag) => (
                <Button
                  key={tag.name}
                  variant={selectedTag === tag.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag.name)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredEndpoints.map((endpoint, index) => (
              <EndpointCard key={`${endpoint.method}-${endpoint.path}-${index}`} endpoint={endpoint} />
            ))}
          </div>

          {filteredEndpoints.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum endpoint encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar sua busca ou filtros</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Authentication */}
        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Autenticação</CardTitle>
              <CardDescription>Como autenticar suas requisições à API</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={authCode} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
