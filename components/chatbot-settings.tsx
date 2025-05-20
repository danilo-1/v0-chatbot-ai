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
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload" // Importar o componente de upload

interface ChatbotSettingsProps {
  chatbot: {
    id: string
    name: string
    description: string | null
    isPublic: boolean
    knowledgeBase: string | null
    imageUrl: string | null // Adicionar campo para a URL da imagem
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
    knowledgeBase: chatbot.knowledgeBase || "",
    imageUrl: chatbot.imageUrl || "", // Adicionar campo para a URL da imagem
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }))
  }

  // Adicionar handler para a imagem
  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }))
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

            {/* Adicionar o componente de upload de imagem */}
            <div className="space-y-2">
              <ImageUpload
                value={formData.imageUrl}
                onChange={handleImageChange}
                label="Chatbot Image"
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">Upload an image or avatar for your chatbot.</p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isPublic">Make this chatbot public</Label>
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
