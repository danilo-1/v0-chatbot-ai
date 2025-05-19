import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"

export const metadata: Metadata = {
  title: "Gerenciamento de Usuários",
  description: "Gerencie os usuários do sistema",
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  // Verificar se o usuário é administrador
  if (!session?.user || session.user.email !== "danilo.nsantana.dns@gmail.com") {
    redirect("/dashboard")
  }

  // Buscar usuários
  const users = await sql`
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u."createdAt",
      COUNT(c.id) as "chatbotCount"
    FROM "User" u
    LEFT JOIN "Chatbot" c ON u.id = c."userId"
    GROUP BY u.id, u.name, u.email, u."createdAt"
    ORDER BY u."createdAt" DESC
  `

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Lista de usuários registrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Data de Registro</th>
                  <th className="px-4 py-2 text-left">Chatbots</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">{user.chatbotCount}</td>
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
