"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { ChatbotAISettings } from "@/components/admin/chatbot-ai-settings"
import { AIModelsManager } from "@/components/admin/ai-models-manager"

export default function GlobalSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [globalConfig, setGlobalConfig] = useState({
    openaiApiKey: "",
    maxTokensPerRequest: 4096,
    defaultModelId: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [chatbots, setChatbots] = useState([])
  const [filteredChatbots, setFilteredChatbots] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchGlobalConfig()
    fetchChatbots()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChatbots(chatbots)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredChatbots(
        chatbots.filter(
          (chatbot: any) => chatbot.name.toLowerCase().includes(query) || chatbot.id.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, chatbots])

  const fetchGlobalConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/global-config")
      if (!response.ok) {
        throw new Error("Failed to fetch global configuration")
      }
      const data = await response.json()
      setGlobalConfig({
        openaiApiKey: data.openaiApiKey || "",
        maxTokensPerRequest: data.maxTokensPerRequest || 4096,
        defaultModelId: data.defaultModelId || "",
      })
    } catch (error) {
      console.error("Error fetching global configuration:", error)
      toast({
        title: "Error",
        description: "Failed to fetch global configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchChatbots = async () => {
    try {
      const response = await fetch("/api/chatbots")
      if (!response.ok) {
        throw new Error("Failed to fetch chatbots")
      }
      const data = await response.json()
      setChatbots(data)
      setFilteredChatbots(data)
    } catch (error) {
      console.error("Error fetching chatbots:", error)
      toast({
        title: "Error",
        description: "Failed to fetch chatbots",
        variant: "destructive",
      })
    }
  }

  const handleSaveConfig = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/admin/global-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(globalConfig),
      })

      if (!response.ok) {
        throw new Error("Failed to update global configuration")
      }

      toast({
        title: "Success",
        description: "Global configuration updated successfully",
      })
    } catch (error) {
      console.error("Error updating global configuration:", error)
      toast({
        title: "Error",
        description: "Failed to update global configuration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGlobalConfig((prev) => ({
      ...prev,
      [name]: name === "maxTokensPerRequest" ? Number.parseInt(value) || 0 : value,
    }))
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Global Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai-models">AI Models</TabsTrigger>
          <TabsTrigger value="chatbot-settings">Chatbot AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure global settings for the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="openaiApiKey" className="text-sm font-medium">
                    OpenAI API Key
                  </label>
                  <Input
                    id="openaiApiKey"
                    name="openaiApiKey"
                    type="password"
                    value={globalConfig.openaiApiKey}
                    onChange={handleInputChange}
                    placeholder="sk-..."
                  />
                  <p className="text-sm text-muted-foreground">Your OpenAI API key for generating chatbot responses</p>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="maxTokensPerRequest" className="text-sm font-medium">
                    Max Tokens Per Request
                  </label>
                  <Input
                    id="maxTokensPerRequest"
                    name="maxTokensPerRequest"
                    type="number"
                    value={globalConfig.maxTokensPerRequest}
                    onChange={handleInputChange}
                    min="1"
                    max="32000"
                  />
                  <p className="text-sm text-muted-foreground">Maximum number of tokens to use per API request</p>
                </div>

                <Button onClick={handleSaveConfig} disabled={saving} className="mt-4">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-models">
          <AIModelsManager />
        </TabsContent>

        <TabsContent value="chatbot-settings">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot AI Settings</CardTitle>
              <CardDescription>Configure AI settings for individual chatbots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search chatbots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-6">
                {filteredChatbots.length === 0 ? (
                  <p className="text-muted-foreground">No chatbots found</p>
                ) : (
                  filteredChatbots.map((chatbot: any) => (
                    <ChatbotAISettings key={chatbot.id} chatbot={chatbot} onUpdate={fetchChatbots} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
