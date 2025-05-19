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
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function GlobalSettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
              <p className="text-sm text-muted-foreground mt-2">Default maximum number of tokens for new chatbots.</p>
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
    </div>
  )
}
