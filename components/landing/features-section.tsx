import { Brain, Code, Compass, Database, Palette, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Recursos</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Tudo que você precisa para criar chatbots incríveis
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nossa plataforma oferece todas as ferramentas necessárias para criar, personalizar e gerenciar chatbots
              inteligentes para o seu negócio.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">IA Avançada</h3>
            <p className="text-center text-muted-foreground">
              Chatbots alimentados por modelos de linguagem de última geração.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Personalização</h3>
            <p className="text-center text-muted-foreground">
              Adapte o visual e comportamento do chatbot à identidade da sua marca.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Base de Conhecimento</h3>
            <p className="text-center text-muted-foreground">
              Alimente seu chatbot com informações específicas do seu negócio.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Integração Simples</h3>
            <p className="text-center text-muted-foreground">
              Adicione o chatbot ao seu site com apenas algumas linhas de código.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Análise de Desempenho</h3>
            <p className="text-center text-muted-foreground">Acompanhe métricas e melhore seu chatbot continuamente.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Respostas Rápidas</h3>
            <p className="text-center text-muted-foreground">
              Atendimento instantâneo para seus clientes, 24 horas por dia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
