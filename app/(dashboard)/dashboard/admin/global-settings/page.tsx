"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Bot } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ChatbotAISettings } from "@/components/admin/chatbot-ai-settings"
// Update the import for AIModelsManager
import { AIModelsManager } from "@/components/admin/openai-models-manager"

export default function GlobalSettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedChatbot, setSelectedChatbot] = useState(null)

  const [formData, setFormData] = useState({
    globalPrompt: "",
    allowedTopics: "",
    blockedTopics: "",
    maxTokens: 2000,
    temperature: 0.7,
  })

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.email !== "danilo.nsantana.dns@gmail.com") {
      router.push("/dashboard")
      return
    }

    // Fetch global config
    const fetchGlobalConfig = async () => {
      try {
        const response = await fetch("/api/admin/global-config")

        if (!response.ok) {
          throw new Error("Failed to fetch global config")
        }

        const data = await response.json()
        setFormData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch global settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGlobalConfig()
  }, [session, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemperatureChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, temperature: value[0] }))
  }

  const handleMaxTokensChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, maxTokens: value[0] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/global-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update global config")
      }

      toast({
        title: "Settings saved",
        description: "Global settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update global settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSelectedChatbot(null)

    try {
      const response = await fetch(`/api/admin/chatbot-settings?search=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Failed to search chatbots")
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search chatbots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectChatbot = async (id: string) => {
    setIsSearching(true)

    try {
      const response = await fetch(`/api/admin/chatbot-settings?id=${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch chatbot details")
      }

      const data = await response.json()
      setSelectedChatbot(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chatbot details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
        <p className="text-muted-foreground">Configure global settings that apply to all chatbots.</p>
      </div>

      <Tabs defaultValue="global">
        {/* Modificar a TabsList para incluir a nova aba de modelos */}
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="models">OpenAI Models</TabsTrigger>
          <TabsTrigger value="chatbots">Chatbot AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6 mt-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Global Prompt</CardTitle>
                <CardDescription>Set the base prompt that will be used for all chatbots.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="globalPrompt">Global Prompt</Label>
                  <Textarea
                    id="globalPrompt"
                    name="globalPrompt"
                    value={formData.globalPrompt}
                    onChange={handleChange}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    This prompt will be combined with each chatbot's custom prompt. Use this to set global behavior
                    guidelines for all chatbots.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Define what topics chatbots can and cannot discuss.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allowedTopics">Allowed Topics</Label>
                  <Textarea
                    id="allowedTopics"
                    name="allowedTopics"
                    value={formData.allowedTopics}
                    onChange={handleChange}
                    rows={3}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Comma-separated list of topics that chatbots are allowed to discuss.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockedTopics">Blocked Topics</Label>
                  <Textarea
                    id="blockedTopics"
                    name="blockedTopics"
                    value={formData.blockedTopics}
                    onChange={handleChange}
                    rows={3}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Comma-separated list of topics that chatbots should not discuss.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Default AI Settings</CardTitle>
                <CardDescription>Set default AI parameters for all chatbots.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Default Temperature: {formData.temperature.toFixed(1)}</Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[formData.temperature]}
                    onValueChange={handleTemperatureChange}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Default temperature for new chatbots. Lower values make responses more focused and deterministic.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maxTokens">Default Max Tokens: {formData.maxTokens}</Label>
                  </div>
                  <Slider
                    id="maxTokens"
                    min={100}
                    max={4000}
                    step={100}
                    value={[formData.maxTokens]}
                    onValueChange={handleMaxTokensChange}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Default maximum number of tokens for new chatbots.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Global Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Adicionar o novo TabsContent para os modelos da OpenAI após o TabsContent de global */}
        <TabsContent value="models" className="space-y-6 mt-6">
          <AIModelsManager />
        </TabsContent>

        <TabsContent value="chatbots" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot AI Settings</CardTitle>
              <CardDescription>Manage AI settings for specific chatbots.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search chatbots by name, description, or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {searchResults.length > 0 && !selectedChatbot && (
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium">Search Results</div>
                  <div className="divide-y">
                    {searchResults.map((chatbot) => (
                      <div
                        key={chatbot.id}
                        className="p-3 hover:bg-muted/50 cursor-pointer flex items-center justify-between"
                        onClick={() => handleSelectChatbot(chatbot.id)}
                      >
                        <div>
                          <div className="font-medium">{chatbot.name}</div>
                          <div className="text-sm text-muted-foreground">
                            By {chatbot.userName} ({chatbot.userEmail})
                          </div>
                          {chatbot.description && (
                            <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{chatbot.description}</div>
                          )}
                        </div>
                        <div
                          className={`h-3 w-3 rounded-full ${chatbot.isPublic ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && searchQuery && !isSearching && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No chatbots found matching your search.</p>
                </div>
              )}

              {selectedChatbot && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{selectedChatbot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {selectedChatbot.userName} ({selectedChatbot.userEmail})
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedChatbot(null)}>
                      Back to Search
                    </Button>
                  </div>

                  <ChatbotAISettings chatbot={selectedChatbot} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
