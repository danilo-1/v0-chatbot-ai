import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Settings,
  Users,
  Bot,
  Cpu,
  BarChart,
  AlertTriangle,
  Wrench,
  Server,
  Shield,
  Activity,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administração centralizada do sistema",
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  // Verificar se o usuário é administrador
  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>

      <Tabs defaultValue="diagnostics">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Diagnósticos</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Banco de Dados</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Monitoramento</span>
          </TabsTrigger>
        </TabsList>

        {/* Seção de Diagnósticos */}
        <TabsContent value="diagnostics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Diagnóstico do Sistema
                </CardTitle>
                <CardDescription>Verificação geral do estado do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verifique o estado geral do sistema, incluindo conexões, variáveis de ambiente e sessões.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/admin/diagnostics">Acessar Diagnóstico</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Diagnóstico do Neon
                </CardTitle>
                <CardDescription>Verificação detalhada da conexão com o Neon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analise a conexão com o banco de dados Neon, incluindo latência, SSL e estrutura de tabelas.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/admin/neon-diagnostics">Acessar Diagnóstico</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-green-500" />
                  Correção de Conexão
                </CardTitle>
                <CardDescription>Analise e corrija a string de conexão</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Obtenha sugestões para melhorar a string de conexão com o banco de dados.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/admin/fix-connection-string">Corrigir Conexão</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-500" />
                  Teste de Conexão
                </CardTitle>
                <CardDescription>Teste diferentes métodos de conexão</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare diferentes métodos de conexão com o banco de dados para identificar o mais eficiente.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/admin/neon-connection-test">Testar Conexões</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Emergência
                </CardTitle>
                <CardDescription>Ferramentas de emergência para o banco de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acesse ferramentas de emergência para diagnosticar e reparar problemas críticos.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="destructive">
                  <Link href="/admin/emergency">Acessar Emergência</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Seção de Banco de Dados */}
        <TabsContent value="database" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Estrutura do Banco
                </CardTitle>
                <CardDescription>Visualize a estrutura do banco de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore as tabelas, colunas e relacionamentos do banco de dados.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/admin/db-structure">Ver Estrutura</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  Reparar Banco
                </CardTitle>
                <CardDescription>Repare o esquema do banco de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Execute operações de reparo no banco de dados, como criar tabelas ausentes.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/api/db-repair">Reparar Banco</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-500" />
                  Teste do Prisma
                </CardTitle>
                <CardDescription>Teste a conexão via Prisma</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verifique se o Prisma está conseguindo se conectar corretamente ao banco de dados.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/admin/prisma-test">Testar Prisma</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Seção de Configurações */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Configurações Globais
                </CardTitle>
                <CardDescription>Gerencie as configurações globais do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure parâmetros globais, como prompts padrão e moderação de conteúdo.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/global-settings">Configurações Globais</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-500" />
                  Modelos de IA
                </CardTitle>
                <CardDescription>Gerencie os modelos de IA disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Adicione, edite e configure os modelos de IA disponíveis para os chatbots.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/global-settings?tab=ai-models">Gerenciar Modelos</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-green-500" />
                  Configurações de Chatbots
                </CardTitle>
                <CardDescription>Gerencie as configurações de IA dos chatbots</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure as configurações de IA específicas para cada chatbot.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/global-settings?tab=chatbot-settings">Configurar Chatbots</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Gerenciamento de Usuários
                </CardTitle>
                <CardDescription>Gerencie os usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize, edite e gerencie os usuários registrados no sistema.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/users">Gerenciar Usuários</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Seção de Monitoramento */}
        <TabsContent value="monitoring" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  Telemetria
                </CardTitle>
                <CardDescription>Visualize dados de telemetria do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acesse estatísticas detalhadas sobre o uso do sistema, incluindo chatbots e usuários.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/telemetry">Ver Telemetria</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Logs do Sistema
                </CardTitle>
                <CardDescription>Visualize os logs do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acesse os logs do sistema para identificar e resolver problemas.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/logs">Ver Logs</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-green-500" />
                  Status dos Chatbots
                </CardTitle>
                <CardDescription>Monitore o status dos chatbots</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize o status e a performance dos chatbots em tempo real.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/chatbot-status">Status dos Chatbots</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
