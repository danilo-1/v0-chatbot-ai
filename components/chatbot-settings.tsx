"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ChatbotSettingsProps {
  chatbot: {
    id: string
    name: string
    description: string | null
    isPublic: boolean
    temperature: number
    maxTokens: number
    knowledgeBase: string | null
    customPrompt: string | null
  }
}

export function ChatbotSettings({ chatbot }: ChatbotSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: chatbot.name,
    description: chatbot.description || "",
    isPublic: chatbot.isPublic,
    temperature: chatbot.temperature,
    maxTokens: chatbot.maxTokens,
    knowledgeBase: chatbot.knowledgeBase || "",
    customPrompt: chatbot.customPrompt || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }))
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
      console.log("Submitting chatbot update:", formData)

      const response = await fetch(`/api/chatbots/${chatbot.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status)

      const data = await response.json()

      if (!response.ok) {
        console.error("API error:", data)
        throw new Error(data.details || data.error || "Failed to update chatbot")
      }

      console.log("Updated chatbot:", data)

      toast({
        title: "Settings saved",
        description: "Your chatbot settings have been updated.",
      })

      // Force a refresh of the router cache
      router.refresh()
    } catch (error) {
      console.error("Error updating chatbot:", error)
      setError(error instanceof Error ? error.message : "Failed to update chatbot. Please try again.")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update chatbot. Please try again.",
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
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your chatbot's basic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isPublic">Make this chatbot public</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Settings</CardTitle>
            <CardDescription>Customize how your AI chatbot responds.</CardDescription>
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
                Customize how your chatbot introduces itself and behaves. This is combined with the global prompt.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>Update the information your chatbot uses to answer questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="knowledgeBase">Knowledge Base</Label>
              <Textarea
                id="knowledgeBase"
                name="knowledgeBase"
                value={formData.knowledgeBase}
                onChange={handleChange}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Add all the information your chatbot needs to answer questions about your business. Include FAQs,
                product details, policies, and any other relevant information.
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
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
