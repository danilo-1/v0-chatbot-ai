"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function NewChatbotPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    knowledgeBase: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/chatbots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create chatbot")
      }

      const chatbot = await response.json()

      toast({
        title: "Chatbot created",
        description: "Your chatbot has been successfully created.",
      })

      router.push(`/dashboard/chatbots/${chatbot.id}/playground`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chatbot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Chatbot</h1>
        <p className="text-muted-foreground">Fill in the details below to create your AI chatbot.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide basic information about your chatbot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="E.g., Customer Support Bot"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">This name will be displayed to users.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what your chatbot does..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">A brief description of your chatbot's purpose.</p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isPublic">Make this chatbot public</Label>
            </div>
          </CardContent>

          <CardHeader className="border-t pt-6">
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>Provide information that your chatbot will use to answer questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="knowledgeBase">Knowledge Base</Label>
              <Textarea
                id="knowledgeBase"
                name="knowledgeBase"
                placeholder="Add FAQs, product information, policies, etc..."
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

          <CardFooter className="flex justify-between border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/chatbots")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Chatbot"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
