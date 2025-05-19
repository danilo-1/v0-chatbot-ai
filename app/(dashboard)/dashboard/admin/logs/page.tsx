import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Logs do Sistema",
  description: "Visualize os logs do sistema",
}

export default async function LogsPage() {
  const session = await getServerSession(authOptions)

  // Verificar se o usuário é administrador
  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    redirect("/dashboard")
  }

  // Buscar logs (exemplo - ajuste conforme sua estrutura de logs)
  const logs = await sql`
    SELECT * FROM (
      SELECT 
        'auth' as type,
        u.email as "userIdentifier",
        a."createdAt" as timestamp,
        'Login' as action,
        a.provider as details
      FROM "Account" a
      JOIN "User" u ON a."userId" = u.id
      
      UNION ALL
      
      SELECT 
        'chatbot' as type,
        u.email as "userIdentifier",
        c."createdAt" as timestamp,
        'Chatbot criado' as action,
        c.name as details
      FROM "Chatbot" c
      JOIN "User" u ON c."userId" = u.id
    ) as logs
    ORDER BY timestamp DESC
    LIMIT 100
  `

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Logs do Sistema</h1>

      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
          <CardDescription>Últimas 100 atividades registradas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Usuário</th>
                  <th className="px-4 py-2 text-left">Data/Hora</th>
                  <th className="px-4 py-2 text-left">Ação</th>
                  <th className="px-4 py-2 text-left">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <Badge
                        variant={
                          log.type === "auth"
                            ? "outline"
                            : log.type === "chatbot"
                              ? "secondary"
                              : log.type === "error"
                                ? "destructive"
                                : "default"
                        }
                      >
                        {log.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">{log.userIdentifier}</td>
                    <td className="px-4 py-2">
                      {new Date(log.timestamp).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
