"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Info, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NeedHelpAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    enabled: true,
    defaultMode: "help",
    defaultPosition: "bottom-right",
    defaultTheme: "light",
    buttonText: "Need Help?",
    buttonIcon: "question",
    primaryColor: "#7c3aed",
    autoOpenDelay: "disabled",
    supportChannels: {
      articles: true,
      faq: true,
      chat: true,
      contact: true,
    },
  })
  const [articles, setArticles] = useState([
    {
      id: "1",
      title: "Primeiros passos",
      description: "Aprenda como começar a usar nossa plataforma.",
      content: "Conteúdo detalhado do artigo...",
      category: "getting-started",
    },
    {
      id: "2",
      title: "Como personalizar seu chatbot",
      description: "Guia completo de personalização.",
      content: "Conteúdo detalhado do artigo...",
      category: "customization",
    },
    {
      id: "3",
      title: "Integrando com seu site",
      description: "Métodos de integração disponíveis.",
      content: "Conteúdo detalhado do artigo...",
      category: "integration",
    },
  ])
  const [faqs, setFaqs] = useState([
    {
      id: "1",
      question: "Como posso criar um novo chatbot?",
      answer:
        'Para criar um novo chatbot, acesse o painel de controle e clique no botão "Novo Chatbot". Siga as instruções para configurar seu chatbot.',
      category: "general",
    },
    {
      id: "2",
      question: "Quais são os planos disponíveis?",
      answer:
        "Oferecemos planos Gratuito, Básico, Profissional e Empresarial. Cada plano tem diferentes limites e recursos.",
      category: "billing",
    },
    {
      id: "3",
      question: "Como personalizar as respostas do chatbot?",
      answer:
        "Você pode personalizar as respostas do chatbot através do sistema de prompts e base de conhecimento. Acesse as configurações do seu chatbot para mais detalhes.",
      category: "customization",
    },
  ])
  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "João Silva",
      email: "joao@exemplo.com",
      subject: "Dúvida sobre integração",
      message: "Como posso integrar o chatbot com meu site WordPress?",
      status: "PENDING",
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Maria Souza",
      email: "maria@exemplo.com",
      subject: "Problema com respostas",
      message: "Meu chatbot não está respondendo corretamente às perguntas.",
      status: "ANSWERED",
      createdAt: "2023-05-14T14:45:00Z",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      email: "carlos@exemplo.com",
      subject: "Solicitação de recurso",
      message: "Gostaria de sugerir um novo recurso para a plataforma.",
      status: "PENDING",
      createdAt: "2023-05-13T09:15:00Z",
    },
  ])
  const [stats, setStats] = useState({
    totalInteractions: 1245,
    articleViews: 532,
    chatMessages: 876,
    contactForms: 87,
    resolutionRate: 78,
    popularArticles: [
      { id: "1", title: "Primeiros passos", views: 203 },
      { id: "2", title: "Integrando com seu site", views: 187 },
      { id: "3", title: "Como personalizar seu chatbot", views: 142 },
    ],
    popularQuestions: [
      { id: "1", question: "Como posso criar um novo chatbot?", count: 45 },
      { id: "2", question: "Quais são os planos disponíveis?", count: 38 },
      { id: "3", question: "Como personalizar as respostas do chatbot?", count: 29 },
    ],
  })

  const [newArticle, setNewArticle] = useState({ title: "", description: "", content: "", category: "general" })
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", category: "general" })
  const [selectedContact, setSelectedContact] = useState(null)
  const [contactResponse, setContactResponse] = useState("")

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    // Simular salvamento
    setTimeout(() => {
      setSaving(false)
      // Mostrar mensagem de sucesso
      alert("Configurações salvas com sucesso!")
    }, 1000)
  }

  const handleAddArticle = () => {
    if (newArticle.title && newArticle.description && newArticle.content) {
      setArticles([
        ...articles,
        {
          id: Date.now().toString(),
          ...newArticle,
        },
      ])
      setNewArticle({ title: "", description: "", content: "", category: "general" })
    }
  }

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter((article) => article.id !== id))
  }

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([
        ...faqs,
        {
          id: Date.now().toString(),
          ...newFaq,
        },
      ])
      setNewFaq({ question: "", answer: "", category: "general" })
    }
  }

  const handleDeleteFaq = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
  }

  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
    setContactResponse("")
  }

  const handleRespondToContact = () => {
    if (selectedContact && contactResponse) {
      setContacts(
        contacts.map((contact) => (contact.id === selectedContact.id ? { ...contact, status: "ANSWERED" } : contact)),
      )
      setSelectedContact(null)
      setContactResponse("")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Módulo "Need Help"</h1>
          <p className="text-muted-foreground">Gerencie o módulo de ajuda contextual para seus chatbots</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="articles">Artigos</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure as opções gerais do módulo "Need Help"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled">Ativar Módulo</Label>
                  <p className="text-sm text-muted-foreground">Ative ou desative o módulo "Need Help"</p>
                </div>
                <Switch
                  id="enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultMode">Modo Padrão</Label>
                  <Select
                    value={settings.defaultMode}
                    onValueChange={(value) => setSettings({ ...settings, defaultMode: value })}
                  >
                    <SelectTrigger id="defaultMode">
                      <SelectValue placeholder="Selecione o modo padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="help">Ajuda</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="combined">Combinado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultPosition">Posição Padrão</Label>
                  <Select
                    value={settings.defaultPosition}
                    onValueChange={(value) => setSettings({ ...settings, defaultPosition: value })}
                  >
                    <SelectTrigger id="defaultPosition">
                      <SelectValue placeholder="Selecione a posição padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Inferior Direito</SelectItem>
                      <SelectItem value="bottom-left">Inferior Esquerdo</SelectItem>
                      <SelectItem value="top-right">Superior Direito</SelectItem>
                      <SelectItem value="top-left">Superior Esquerdo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultTheme">Tema Padrão</Label>
                  <Select
                    value={settings.defaultTheme}
                    onValueChange={(value) => setSettings({ ...settings, defaultTheme: value })}
                  >
                    <SelectTrigger id="defaultTheme">
                      <SelectValue placeholder="Selecione o tema padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonIcon">Ícone do Botão</Label>
                  <Select
                    value={settings.buttonIcon}
                    onValueChange={(value) => setSettings({ ...settings, buttonIcon: value })}
                  >
                    <SelectTrigger id="buttonIcon">
                      <SelectValue placeholder="Selecione o ícone do botão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Interrogação</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="support">Suporte</SelectItem>
                      <SelectItem value="info">Informação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonText">Texto do Botão</Label>
                  <Input
                    id="buttonText"
                    value={settings.buttonText}
                    onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    />
                    <div className="w-10 h-10 rounded border" style={{ backgroundColor: settings.primaryColor }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autoOpenDelay">Atraso para Abrir Automaticamente</Label>
                  <Select
                    value={settings.autoOpenDelay}
                    onValueChange={(value) => setSettings({ ...settings, autoOpenDelay: value })}
                  >
                    <SelectTrigger id="autoOpenDelay">
                      <SelectValue placeholder="Selecione o atraso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Desativado</SelectItem>
                      <SelectItem value="5000">5 segundos</SelectItem>
                      <SelectItem value="10000">10 segundos</SelectItem>
                      <SelectItem value="30000">30 segundos</SelectItem>
                      <SelectItem value="60000">1 minuto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Canais de Suporte</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione quais canais de suporte estarão disponíveis
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="articlesChannel"
                      checked={settings.supportChannels.articles}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          supportChannels: { ...settings.supportChannels, articles: checked },
                        })
                      }
                    />
                    <Label htmlFor="articlesChannel">Artigos</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="faqChannel"
                      checked={settings.supportChannels.faq}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          supportChannels: { ...settings.supportChannels, faq: checked },
                        })
                      }
                    />
                    <Label htmlFor="faqChannel">FAQ</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="chatChannel"
                      checked={settings.supportChannels.chat}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          supportChannels: { ...settings.supportChannels, chat: checked },
                        })
                      }
                    />
                    <Label htmlFor="chatChannel">Chat</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="contactChannel"
                      checked={settings.supportChannels.contact}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          supportChannels: { ...settings.supportChannels, contact: checked },
                        })
                      }
                    />
                    <Label htmlFor="contactChannel">Formulário de Contato</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Artigos de Ajuda</CardTitle>
              <CardDescription>Gerencie os artigos de ajuda disponíveis no módulo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {articles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteArticle(article.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Badge variant="outline">{article.category}</Badge>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Adicionar Novo Artigo</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="articleTitle">Título</Label>
                        <Input
                          id="articleTitle"
                          value={newArticle.title}
                          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="articleCategory">Categoria</Label>
                        <Select
                          value={newArticle.category}
                          onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                        >
                          <SelectTrigger id="articleCategory">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Geral</SelectItem>
                            <SelectItem value="getting-started">Primeiros Passos</SelectItem>
                            <SelectItem value="customization">Personalização</SelectItem>
                            <SelectItem value="integration">Integração</SelectItem>
                            <SelectItem value="billing">Faturamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="articleDescription">Descrição</Label>
                      <Input
                        id="articleDescription"
                        value={newArticle.description}
                        onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="articleContent">Conteúdo</Label>
                      <Textarea
                        id="articleContent"
                        rows={6}
                        value={newArticle.content}
                        onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                      />
                    </div>

                    <Button onClick={handleAddArticle}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Artigo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes (FAQs)</CardTitle>
              <CardDescription>Gerencie as perguntas frequentes disponíveis no módulo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <Card key={faq.id}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteFaq(faq.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Badge variant="outline">{faq.category}</Badge>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Adicionar Nova Pergunta</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faqQuestion">Pergunta</Label>
                        <Input
                          id="faqQuestion"
                          value={newFaq.question}
                          onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="faqCategory">Categoria</Label>
                        <Select
                          value={newFaq.category}
                          onValueChange={(value) => setNewFaq({ ...newFaq, category: value })}
                        >
                          <SelectTrigger id="faqCategory">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Geral</SelectItem>
                            <SelectItem value="getting-started">Primeiros Passos</SelectItem>
                            <SelectItem value="customization">Personalização</SelectItem>
                            <SelectItem value="integration">Integração</SelectItem>
                            <SelectItem value="billing">Faturamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faqAnswer">Resposta</Label>
                      <Textarea
                        id="faqAnswer"
                        rows={4}
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                      />
                    </div>

                    <Button onClick={handleAddFaq}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Pergunta
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mensagens de Contato</CardTitle>
                  <CardDescription>Gerencie as mensagens recebidas através do formulário de contato</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Assunto</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.name}</TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={contact.status === "PENDING" ? "outline" : "default"}>
                              {contact.status === "PENDING" ? "Pendente" : "Respondido"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleSelectContact(contact)}>
                              Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div>
              {selectedContact ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Mensagem</CardTitle>
                    <CardDescription>
                      {selectedContact.name} - {selectedContact.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Assunto</h4>
                      <p>{selectedContact.subject}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Mensagem</h4>
                      <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Data</h4>
                      <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="contactResponse">Resposta</Label>
                      <Textarea
                        id="contactResponse"
                        rows={4}
                        value={contactResponse}
                        onChange={(e) => setContactResponse(e.target.value)}
                        placeholder="Digite sua resposta..."
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedContact(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleRespondToContact}>Responder</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Informações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <p>Selecione uma mensagem para ver os detalhes</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Interações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInteractions}</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Visualizações de Artigos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.articleViews}</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Mensagens de Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.chatMessages}</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
                <p className="text-xs text-muted-foreground">+3% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Artigos Mais Populares</CardTitle>
                <CardDescription>Os artigos mais visualizados pelos usuários</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artigo</TableHead>
                      <TableHead className="text-right">Visualizações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.popularArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>{article.title}</TableCell>
                        <TableCell className="text-right">{article.views}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perguntas Mais Frequentes</CardTitle>
                <CardDescription>As perguntas mais feitas pelos usuários</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pergunta</TableHead>
                      <TableHead className="text-right">Ocorrências</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.popularQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.question}</TableCell>
                        <TableCell className="text-right">{question.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
