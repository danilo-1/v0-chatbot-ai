"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ChatbotAISettingsProps {
  chatbot: any
  onUpdate: () => void
}

export function ChatbotAISettings({ chatbot, onUpdate }: ChatbotAISettingsProps) {
  const [customPrompt, setCustomPrompt] = useState(chatbot.customPrompt || "")
  const [modelId, setModelId] = useState(chatbot.modelId || "default")
  const [saving, setSaving] = useState(false)
  const [models, setModels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/ai-models")
      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error("Error fetching models:", error)
      toast({
        title: "Error",
        description: "Failed to fetch AI models",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/admin/chatbot-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: chatbot.id,
          customPrompt,
          modelId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update chatbot settings")
      }

      toast({
        title: "Success",
        description: "Chatbot AI settings updated successfully",
      })

      onUpdate()
    } catch (error) {
      console.error("Error updating chatbot settings:", error)
      toast({
        title: "Error",
        description: "Failed to update chatbot settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{chatbot.name}</CardTitle>
            <CardDescription>ID: {chatbot.id}</CardDescription>
          </div>
          <Badge variant={chatbot.isPublic ? "default" : "secondary"}>{chatbot.isPublic ? "Public" : "Private"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor={`model-${chatbot.id}`} className="text-sm font-medium">
              AI Model
            </label>
            <Select value={modelId} onValueChange={setModelId} disabled={loading}>
              <SelectTrigger id={`model-${chatbot.id}`}>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Use Default Model</SelectItem>
                {models
                  .filter((model) => model.isActive)
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} {model.isDefault && "(Default)"}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">The AI model to use for this chatbot</p>
          </div>

          <div className="grid gap-2">
            <label htmlFor={`prompt-${chatbot.id}`} className="text-sm font-medium">
              Custom Prompt
            </label>
            <Textarea
              id={`prompt-${chatbot.id}`}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`You are a helpful AI assistant for ${chatbot.name}. Provide concise and accurate responses.`}
              rows={5}
            />
            <p className="text-sm text-muted-foreground">Custom system prompt for this chatbot</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
