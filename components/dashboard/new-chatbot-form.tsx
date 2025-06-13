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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Chatbot name must be at least 2 characters.",
  }),
})

export interface UserLimits {
  isWithinLimits: boolean
  isWithinMessageLimit: boolean
  isWithinChatbotLimit: boolean
  messageCount: number
  chatbotCount: number
  messageLimit: number
  chatbotLimit: number
  percentageUsed: number
}

interface NewChatbotFormProps {
  limits: UserLimits
}

export default function NewChatbotForm({ limits }: NewChatbotFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [chatbotCount, setChatbotCount] = useState(0)

  if (!limits.isWithinChatbotLimit) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Criar Novo Chatbot</h1>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limite de chatbots excedido</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              Você atingiu o limite de {limits.chatbotLimit} chatbots do seu plano atual. Para criar mais chatbots, faça
              upgrade para um plano com mais recursos.
            </p>
            <div className="flex gap-4 mt-4">
              <Button asChild>
                <Link href="/dashboard/subscription">Ver planos disponíveis</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/chatbots">Gerenciar chatbots existentes</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

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

  return (
    <div className="container mx-auto py-6 space-y-6">
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

