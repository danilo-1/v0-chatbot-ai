"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { DeleteChatbotButton } from "./delete-chatbot-button"

interface ChatbotSettingsProps {
  chatbot: any
  isNew?: boolean
}

export function ChatbotSettings({ chatbot, isNew = false }: ChatbotSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState(chatbot?.name || "")
  const [isPublic, setIsPublic] = useState(chatbot?.isPublic || false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Chatbot name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const url = isNew ? "/api/chatbots" : `/api/chatbots/${chatbot.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          isPublic,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save chatbot")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: isNew ? "Chatbot created successfully" : "Chatbot updated successfully",
      })

      if (isNew) {
        router.push(`/dashboard/chatbots/${data.id}/edit`)
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error saving chatbot:", error)
      toast({
        title: "Error",
        description: "Failed to save chatbot",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? "Create New Chatbot" : "Chatbot Settings"}</CardTitle>
        <CardDescription>{isNew ? "Configure your new chatbot" : "Update your chatbot settings"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Chatbot" />
          <p className="text-sm text-muted-foreground">The name of your chatbot</p>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="public">Public</Label>
            <p className="text-sm text-muted-foreground">Make this chatbot publicly accessible</p>
          </div>
          <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isNew && <DeleteChatbotButton id={chatbot.id} />}
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isNew ? "Create Chatbot" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
