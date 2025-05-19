import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Depoimentos</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">O que nossos clientes dizem</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Veja como nossa plataforma tem ajudado empresas a melhorar o atendimento ao cliente.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="Avatar" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">João Silva</CardTitle>
                  <CardDescription>E-commerce de Moda</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "Nosso chatbot responde às dúvidas mais comuns dos clientes, reduzindo em 40% o volume de tickets no
                suporte. A implementação foi muito simples."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="Avatar" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Maria Costa</CardTitle>
                  <CardDescription>Agência de Viagens</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "O chatbot nos ajuda a qualificar leads 24/7. Conseguimos aumentar nossas conversões em 25% desde que
                implementamos a solução."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="Avatar" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>PO</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Pedro Oliveira</CardTitle>
                  <CardDescription>Escola de Idiomas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "Nossos alunos adoram poder tirar dúvidas a qualquer momento. A personalização do chatbot com nossa
                identidade visual ficou perfeita."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
