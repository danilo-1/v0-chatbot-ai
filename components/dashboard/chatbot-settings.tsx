"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Bot, Save } from "lucide-react"

export function ChatbotSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    name: "Assistente de E-commerce",
    welcomeMessage: "Olá! Como posso ajudar você hoje?",
    temperature: 0.7,
    maxTokens: 1024,
    enableMemory: true,
    context:
      "Este é um chatbot para uma loja de e-commerce que vende produtos eletrônicos. Oferecemos smartphones, laptops, tablets e acessórios. Nosso prazo de entrega é de 3-5 dias úteis para capitais e 5-8 dias úteis para outras localidades. Aceitamos pagamentos via cartão de crédito, boleto e Pix. Oferecemos garantia de 12 meses em todos os produtos.",
    appearance: {
      primaryColor: "#7C3AED",
      botName: "Assistente Virtual",
      botAvatar: "/placeholder.svg?height=40&width=40",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean, name: string) => {
    setSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSliderChange = (value: number[], name: string) => {
    setSettings((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, [name]: value },
    }))
  }

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do chatbot foram atualizadas com sucesso.",
    })
  }

  return (
    <Tabs defaultValue="basic" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Básico</TabsTrigger>
        <TabsTrigger value="advanced">Avançado</TabsTrigger>
        <TabsTrigger value="appearance">Aparência</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Chatbot</Label>
          <Input id="name" name="name" value={settings.name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
          <Textarea id="welcomeMessage" name="welcomeMessage" value={settings.welcomeMessage} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="context">Base de Conhecimento</Label>
          <Textarea
            id="context"
            name="context"
            className="min-h-[150px]"
            value={settings.context}
            onChange={handleChange}
          />
          <p className="text-sm text-muted-foreground">
            Informações sobre seu negócio que o chatbot usará para responder perguntas
          </p>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature">Temperatura: {settings.temperature}</Label>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[settings.temperature]}
            onValueChange={(value) => handleSliderChange(value, "temperature")}
          />
          <p className="text-sm text-muted-foreground">
            Controla a aleatoriedade das respostas. Valores mais baixos são mais determinísticos, valores mais altos são
            mais criativos.
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxTokens">Tamanho máximo da resposta: {settings.maxTokens}</Label>
          </div>
          <Slider
            id="maxTokens"
            min={256}
            max={2048}
            step={128}
            value={[settings.maxTokens]}
            onValueChange={(value) => handleSliderChange(value, "maxTokens")}
          />
          <p className="text-sm text-muted-foreground">Limita o tamanho das respostas geradas pelo chatbot.</p>
        </div>
        <Separator />
        <div className="flex items-center space-x-2">
          <Switch
            id="enableMemory"
            checked={settings.enableMemory}
            onCheckedChange={(checked) => handleSwitchChange(checked, "enableMemory")}
          />
          <Label htmlFor="enableMemory">Habilitar memória de conversas</Label>
        </div>
        <p className="text-sm text-muted-foreground">Permite que o chatbot lembre-se do contexto da conversa atual.</p>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Cor Primária</Label>
          <div className="flex items-center gap-2">
            <Input
              id="primaryColor"
              name="primaryColor"
              type="color"
              value={settings.appearance.primaryColor}
              onChange={handleAppearanceChange}
              className="w-12 h-8 p-1"
            />
            <Input
              value={settings.appearance.primaryColor}
              onChange={handleAppearanceChange}
              name="primaryColor"
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="botName">Nome Exibido</Label>
          <Input id="botName" name="botName" value={settings.appearance.botName} onChange={handleAppearanceChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="botAvatar">Avatar do Chatbot</Label>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <Button variant="outline" size="sm">
              Alterar Avatar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Recomendado: imagem quadrada de pelo menos 200x200 pixels</p>
        </div>
      </TabsContent>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </Tabs>
  )
}
