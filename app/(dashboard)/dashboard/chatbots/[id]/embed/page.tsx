import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/ui/copy-button"
import { neon } from "@neondatabase/serverless"

export default async function EmbedPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return notFound()
  }

  try {
    // Usar o cliente neon diretamente
    const sql = neon(process.env.DATABASE_URL!)

    // Verificar se o chatbot existe e pertence ao usuário
    const chatbot = await sql`
      SELECT * FROM "Chatbot" 
      WHERE id = ${params.id} AND "userId" = ${session.user.id}
    `

    if (!chatbot || chatbot.length === 0) {
      return notFound()
    }

    const chatbotData = chatbot[0]

    // Usar a URL correta do aplicativo
    const baseUrl = "https://v0-chatbot-ai-kf.vercel.app"

    const scriptEmbed = `<script src="${baseUrl}/api/widget/${params.id}" async></script>`
    const iframeEmbed = `<iframe src="${baseUrl}/embed/${params.id}" width="350" height="500" frameborder="0"></iframe>`
    const apiExample = `
// Exemplo de uso da API
async function sendMessage(message) {
  const response = await fetch("${baseUrl}/api/v1/chatbots/${params.id}/chat", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      messages: [{ role: 'user', content: message }]
    })
  });
  return await response.json();
}
`

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Implementar Chatbot</h1>
        <p className="text-muted-foreground mb-8">
          Escolha uma das opções abaixo para implementar o chatbot "{chatbotData.name}" em seu site.
        </p>

        <Tabs defaultValue="widget" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="widget">Widget Flutuante</TabsTrigger>
            <TabsTrigger value="iframe">iFrame</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="widget">
            <Card>
              <CardHeader>
                <CardTitle>Widget Flutuante</CardTitle>
                <CardDescription>
                  Adicione um botão flutuante que abre o chatbot quando clicado. Esta é a opção mais simples e
                  recomendada.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Código Básico</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{scriptEmbed}</code>
                    </pre>
                    <CopyButton value={scriptEmbed} className="absolute top-2 right-2" />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Código com Personalização</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{`<script 
  src="${baseUrl}/api/widget/${params.id}" 
  data-position="bottom-right" 
  data-theme="light"
  data-initial-message="Como posso ajudar?"
  async>
</script>`}</code>
                    </pre>
                    <CopyButton
                      value={`<script 
  src="${baseUrl}/api/widget/${params.id}" 
  data-position="bottom-right" 
  data-theme="light"
  data-initial-message="Como posso ajudar?"
  async>
</script>`}
                      className="absolute top-2 right-2"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Instruções</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Copie o código acima</li>
                    <li>
                      Cole-o antes do fechamento da tag <code>&lt;/body&gt;</code> em seu site
                    </li>
                    <li>O widget será carregado automaticamente</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="iframe">
            <Card>
              <CardHeader>
                <CardTitle>iFrame Embed</CardTitle>
                <CardDescription>
                  Incorpore o chatbot diretamente em uma seção específica do seu site usando um iFrame.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{iframeEmbed}</code>
                    </pre>
                    <CopyButton value={iframeEmbed} className="absolute top-2 right-2" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Instruções</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Copie o código acima</li>
                    <li>Cole-o em qualquer lugar do seu HTML onde deseja que o chatbot apareça</li>
                    <li>Ajuste width e height conforme necessário</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API de Integração</CardTitle>
                <CardDescription>Para desenvolvedores que desejam uma integração personalizada.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{apiExample}</code>
                    </pre>
                    <CopyButton value={apiExample} className="absolute top-2 right-2" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Documentação da API</h3>
                  <p>
                    Endpoint: <code>{`${baseUrl}/api/v1/chatbots/${params.id}/chat`}</code>
                  </p>
                  <p>
                    Método: <code>POST</code>
                  </p>
                  <p>Corpo da requisição:</p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                    <code>{`{
  "messages": [
    { "role": "user", "content": "Sua mensagem aqui" }
  ]
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar dados do chatbot:", error)
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Erro</h1>
        <p className="text-red-500">
          Ocorreu um erro ao carregar as opções de embed. Por favor, tente novamente mais tarde.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="bg-muted p-4 rounded-md mt-4 text-sm overflow-x-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        )}
      </div>
    )
  }
}
