"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Lock } from "lucide-react"
import { MethodBadge } from "./method-badge"
import { CodeBlock } from "./code-block"
import type { ApiEndpoint } from "@/lib/api-docs"

interface EndpointCardProps {
  endpoint: ApiEndpoint
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600"
    if (status >= 400 && status < 500) return "text-orange-600"
    if (status >= 500) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MethodBadge method={endpoint.method} />
                <div>
                  <CardTitle className="text-lg font-mono">{endpoint.path}</CardTitle>
                  <CardDescription className="mt-1">{endpoint.title}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {endpoint.auth && <Lock className="h-4 w-4 text-orange-500" title="Requer autenticação" />}
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {endpoint.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            <p className="text-muted-foreground">{endpoint.description}</p>

            {/* Parameters */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Parâmetros</h4>
                <div className="space-y-2">
                  {endpoint.parameters.map((param) => (
                    <div key={param.name} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{param.name}</code>
                        <Badge variant={param.required ? "destructive" : "secondary"} className="text-xs">
                          {param.required ? "obrigatório" : "opcional"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {param.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {param.in}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                      {param.example && (
                        <div className="mt-2">
                          <CodeBlock code={JSON.stringify(param.example, null, 2)} title="Exemplo" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {endpoint.requestBody && (
              <div>
                <h4 className="font-semibold mb-3">Corpo da Requisição</h4>
                <p className="text-sm text-muted-foreground mb-3">{endpoint.requestBody.description}</p>
                {Object.entries(endpoint.requestBody.content).map(([contentType, content]) => (
                  <div key={contentType} className="space-y-2">
                    <Badge variant="outline">{contentType}</Badge>
                    {content.example && (
                      <CodeBlock code={JSON.stringify(content.example, null, 2)} title="Exemplo de Requisição" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Responses */}
            <div>
              <h4 className="font-semibold mb-3">Respostas</h4>
              <div className="space-y-3">
                {endpoint.responses.map((response) => (
                  <div key={response.status} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(response.status)}>{response.status}</Badge>
                      <span className="text-sm">{response.description}</span>
                    </div>
                    {response.content &&
                      Object.entries(response.content).map(([contentType, content]) => (
                        <div key={contentType} className="mt-2">
                          <Badge variant="outline" className="mb-2">
                            {contentType}
                          </Badge>
                          {content.example && (
                            <CodeBlock code={JSON.stringify(content.example, null, 2)} title="Exemplo de Resposta" />
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Try it out */}
            <div className="pt-4 border-t">
              <Button className="w-full" variant="outline">
                🧪 Testar Endpoint
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
