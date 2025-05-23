"use client"

import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"

// Adicione o import do useSubscription
import { useSubscription } from "@/hooks/use-subscription"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Chatbot name must be at least 2 characters.",
  }),
})

export default function NewChatbotPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      const response = await fetch("/api/chatbots", {
        method: "POST",
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        toast({
          title: "Something went wrong.",
          description: "Please try again later.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: "Chatbot created.",
        })
        router.refresh()
        router.push("/dashboard/chatbots")
      }
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const { canCreateChatbot, loading: subscriptionLoading } = useSubscription()
  const [chatbotCount, setChatbotCount] = useState(0)

  // Adicione este useEffect para carregar a contagem de chatbots
  useEffect(() => {
    const fetchChatbotCount = async () => {
      try {
        const response = await fetch("/api/chatbots/count")
        if (response.ok) {
          const data = await response.json()
          setChatbotCount(data.count)
        }
      } catch (error) {
        console.error("Error fetching chatbot count:", error)
      }
    }

    fetchChatbotCount()
  }, [])

  // Verifique se o usuário pode criar mais chatbots
  if (!subscriptionLoading && !canCreateChatbot(chatbotCount)) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Novo Chatbot</h1>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limite de chatbots atingido</AlertTitle>
          <AlertDescription>
            Você atingiu o limite de chatbots do seu plano atual.
            <Link href="/dashboard/subscription" className="underline ml-1">
              Faça upgrade do seu plano
            </Link>{" "}
            para criar mais chatbots.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Novo Chatbot</h1>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Chatbot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            Criar
            <Plus className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </Form>
    </div>
  )
}
