import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, MessageSquare, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Chatbots inteligentes para o seu negócio
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Crie chatbots personalizados que respondem perguntas sobre seu negócio de forma inteligente e natural.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/catalog">
                  Ver catálogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Criar meu chatbot</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Bot className="h-4 w-4" />
                <span>Fácil de personalizar</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Respostas rápidas</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>Integração simples</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-full flex-col rounded-md border bg-muted/50 p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="text-lg font-semibold">Assistente Virtual</div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-md border bg-muted p-2">
                      <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-muted text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="rounded-md border bg-muted p-2">
                      <p className="text-sm">Quais são os horários de funcionamento da loja?</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-md border bg-muted p-2">
                      <p className="text-sm">
                        Nossa loja funciona de segunda a sexta, das 9h às 18h, e aos sábados das 9h às 13h. Aos domingos
                        e feriados estamos fechados.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        placeholder="Digite sua mensagem..."
                        disabled
                      />
                    </div>
                    <Button size="sm" disabled>
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
