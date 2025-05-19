"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Adicionar interface para o modelo OpenAI
interface OpenAIModel {
  id: string
  name: string
  modelId: string
  isDefault: boolean
  maxTokens: number
}

// Modificar a interface ChatbotAISettingsProps para incluir modelId
interface ChatbotAISettingsProps {
  chatbot: {
    id: string
    name: string
    temperature: number
    maxTokens: number
    customPrompt: string | null
    modelId?: string | null
  }
}

export function ChatbotAISettings({ chatbot }: ChatbotAISettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Adicionar estado para os modelos disponíveis
  const [models, setModels] = useState<OpenAIModel[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(true)

  // Adicionar modelId ao formData
  const [formData, setFormData] = useState({
    id: chatbot.id,
    temperature: chatbot.temperature,
    maxTokens: chatbot.maxTokens,
    customPrompt: chatbot.customPrompt || "",
    modelId: chatbot.modelId || "",
  })

  // Adicionar useEffect para carregar os modelos
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true)
      try {
        const response = await fetch("/api/admin/openai-models")
        if (!response.ok) {
          throw new Error("Failed to fetch models")
        }
        const data = await response.json()
        setModels(data.filter((model: OpenAIModel) => model.isActive))
      } catch (error) {
        console.error("Error fetching OpenAI models:", error)
      } finally {
        setIsLoadingModels(false)
      }
    }

    fetchModels()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    setError(null)

    try {
      const response = await fetch("/api/admin/chatbot-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update chatbot AI settings")
      }

      toast({
        title: "Settings saved",
        description: `AI settings for "${chatbot.name}" have been updated.`,
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update chatbot AI settings")
      toast({
        title: "Error",
        description: "Failed to update chatbot AI settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>AI Settings for {chatbot.name}</CardTitle>
            <CardDescription>Customize how this chatbot responds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Adicionar o select de modelo na CardContent, antes do campo de temperatura */}
            <div className="space-y-2">
              <Label htmlFor="modelId">OpenAI Model</Label>
              {isLoadingModels ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading models...</span>
                </div>
              ) : (
                <select
                  id="modelId"
                  name="modelId"
                  value={formData.modelId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, modelId: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Use Default Model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} {model.isDefault ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-sm text-muted-foreground">
                Select which OpenAI model this chatbot should use. Leave empty to use the default model.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature: {formData.temperature.toFixed(1)}</Label>
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
                  Lower values make responses more focused and deterministic. Higher values make responses more creative
                  and varied.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maxTokens">Max Tokens: {formData.maxTokens}</Label>
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
                  Maximum number of tokens (words) in the AI's response.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customPrompt">Custom Prompt</Label>
              <Textarea
                id="customPrompt"
                name="customPrompt"
                value={formData.customPrompt}
                onChange={handleChange}
                rows={4}
                placeholder="You are a helpful assistant for our company..."
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Customize how this chatbot introduces itself and behaves. This is combined with the global prompt.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save AI Settings"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
