"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ChatbotAISettingsProps {
  chatbot: {
    id: string
    name: string
    temperature: number
    maxTokens: number
    customPrompt: string | null
  }
}

export function ChatbotAISettings({ chatbot }: ChatbotAISettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    id: chatbot.id,
    temperature: chatbot.temperature,
    maxTokens: chatbot.maxTokens,
    customPrompt: chatbot.customPrompt || "",
  })

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
