import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Status dos Chatbots",
  description: "Monitore o status dos chatbots",
}

export default async function ChatbotStatusPage() {
  const session = await getServerSession(authOptions)

  // Verificar se o usuário é administrador
  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    redirect("/dashboard")
  }

  // Buscar chatbots com informações de status
  const chatbots = await sql`
    SELECT 
      c.id, 
      c.name, 
      c."isPublic",
      c."createdAt",
      c."updatedAt",
      u.name as "userName",
      u.email as "userEmail",
      m.name as "modelName",
      CASE WHEN c."modelId" IS NULL THEN 'default' ELSE c."modelId" END as "modelId",
      (SELECT COUNT(*) FROM "ChatMessage" cm WHERE cm."chatbotId" = c.id) as "messageCount"
    FROM "Chatbot" c
    JOIN "User" u ON c."userId" = u.id
    LEFT JOIN "AIModel" m ON c."modelId" = m.id
    ORDER BY c."updatedAt" DESC
  `

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Status dos Chatbots</h1>

      <Card>
        <CardHeader>
          <CardTitle>Chatbots</CardTitle>
          <CardDescription>Status e informações dos chatbots no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Usuário</th>
                  <th className="px-4 py-2 text-left">Modelo</th>
                  <th className="px-4 py-2 text-left">Mensagens</th>
                  <th className="px-4 py-2 text-left">Última Atualização</th>
                </tr>
              </thead>
              <tbody>
                {chatbots.map((chatbot) => (
                  <tr key={chatbot.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{chatbot.name}</td>
                    <td className="px-4 py-2">
                      {chatbot.isPublic ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <Badge variant="success">Ativo</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          <Badge variant="outline">Privado</Badge>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <div>{chatbot.userName}</div>
                        <div className="text-xs text-muted-foreground">{chatbot.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="secondary">{chatbot.modelName || "Modelo Padrão"}</Badge>
                    </td>
                    <td className="px-4 py-2">{chatbot.messageCount}</td>
                    <td className="px-4 py-2">
                      {new Date(chatbot.updatedAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
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
