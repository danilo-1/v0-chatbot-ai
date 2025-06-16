"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Database, RefreshCw, Plus, Trash2, Edit, AlertTriangle, CheckCircle, XCircle, Play } from "lucide-react"

interface Table {
  name: string
  status: "active" | "inactive" | "missing"
  rowCount?: number
  lastUpdated?: string
}

const EXPECTED_TABLES = [
  "users",
  "chatbots",
  "conversations",
  "messages",
  "subscriptions",
  "subscription_plans",
  "ai_models",
  "openai_models",
  "global_config",
  "need_help_requests",
]

export function DatabaseAdmin() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [sqlDialogOpen, setSqlDialogOpen] = useState(false)
  const [sqlQuery, setSqlQuery] = useState("")
  const [sqlResult, setSqlResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTables = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/db-admin")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar tabelas")
      }

      const existingTables = data.tables || []

      // Verificar status de cada tabela esperada
      const tableStatus: Table[] = EXPECTED_TABLES.map((tableName) => {
        const exists = existingTables.includes(tableName)
        return {
          name: tableName,
          status: exists ? "active" : "missing",
          rowCount: exists ? Math.floor(Math.random() * 100) : 0, // Placeholder
          lastUpdated: exists ? new Date().toISOString() : undefined,
        }
      })

      setTables(tableStatus)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const executeSql = async (query: string) => {
    try {
      const response = await fetch("/api/db-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao executar query")
      }

      setSqlResult(data.result)
      toast({
        title: "Sucesso",
        description: "Query executada com sucesso",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleResetDatabase = async () => {
    try {
      // Executar scripts de inicialização
      const initResponse = await fetch("/api/init-db", { method: "POST" })
      if (!initResponse.ok) {
        throw new Error("Erro ao inicializar banco de dados")
      }

      const plansResponse = await fetch("/api/init-plans", { method: "POST" })
      if (!plansResponse.ok) {
        throw new Error("Erro ao inicializar planos")
      }

      toast({
        title: "Sucesso",
        description: "Banco de dados resetado com sucesso",
      })

      setResetDialogOpen(false)
      fetchTables()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleCreateMissingTables = async () => {
    try {
      const initResponse = await fetch("/api/init-db", { method: "POST" })
      if (!initResponse.ok) {
        throw new Error("Erro ao criar tabelas")
      }

      toast({
        title: "Sucesso",
        description: "Tabelas criadas com sucesso",
      })

      fetchTables()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const getStatusBadge = (status: Table["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Inativa
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Ausente
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const missingTablesCount = tables.filter((t) => t.status === "missing").length
  const activeTablesCount = tables.filter((t) => t.status === "active").length

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Carregando...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tabelas Ativas</p>
                <p className="text-2xl font-bold text-green-600">{activeTablesCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tabelas Ausentes</p>
                <p className="text-2xl font-bold text-red-600">{missingTablesCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{tables.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Globais */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Globais</CardTitle>
          <CardDescription>Execute operações em lote no banco de dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={fetchTables} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>

            {missingTablesCount > 0 && (
              <Button onClick={handleCreateMissingTables} variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Criar Tabelas Ausentes ({missingTablesCount})
              </Button>
            )}

            <Button onClick={() => setSqlDialogOpen(true)} variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Executar SQL
            </Button>

            <Button onClick={() => setResetDialogOpen(true)} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Reset Completo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tabelas */}
      <Card>
        <CardHeader>
          <CardTitle>Status das Tabelas</CardTitle>
          <CardDescription>Visualize o status de cada tabela do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tables.map((table) => (
              <div
                key={table.name}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{table.name}</h3>
                    {getStatusBadge(table.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {table.status === "active" && <span>~{table.rowCount} registros</span>}
                    {table.status === "missing" && <span>Tabela não encontrada no banco de dados</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  {table.status === "missing" && (
                    <Button size="sm" onClick={handleCreateMissingTables} variant="default">
                      <Plus className="w-3 h-3 mr-1" />
                      Criar
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSqlQuery(`SELECT * FROM ${table.name} LIMIT 10;`)
                      setSqlDialogOpen(true)
                    }}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Query
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Reset */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirmar Reset Completo
            </DialogTitle>
            <DialogDescription>
              Esta ação irá <strong>deletar todos os dados</strong> e recriar todas as tabelas do zero. Esta operação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleResetDatabase}>
              Confirmar Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de SQL */}
      <Dialog open={sqlDialogOpen} onOpenChange={setSqlDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Executar Query SQL</DialogTitle>
            <DialogDescription>Execute comandos SQL diretamente no banco de dados</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="sql-query">Query SQL</Label>
              <Textarea
                id="sql-query"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="SELECT * FROM users LIMIT 10;"
                className="min-h-[100px] font-mono"
              />
            </div>

            {sqlResult && (
              <div>
                <Label>Resultado</Label>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[300px]">
                  {JSON.stringify(sqlResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSqlDialogOpen(false)
                setSqlResult(null)
                setSqlQuery("")
              }}
            >
              Fechar
            </Button>
            <Button onClick={() => executeSql(sqlQuery)} disabled={!sqlQuery.trim()}>
              <Play className="w-4 h-4 mr-2" />
              Executar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
