import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Preços</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Planos para todos os tamanhos de negócio
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Escolha o plano ideal para o seu negócio e comece a usar chatbots inteligentes hoje mesmo.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-background shadow-sm">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Básico</h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                <span className="text-3xl font-bold tracking-tight">R$49</span>
                <span className="ml-1 text-xl font-semibold">/mês</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Ideal para pequenos negócios que estão começando.</p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>1 chatbot personalizado</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Até 500 mensagens/mês</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Base de conhecimento básica</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Suporte por email</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto p-6">
              <Button asChild className="w-full">
                <Link href="/login">Começar agora</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background shadow-sm ring-2 ring-primary">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Profissional</h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                <span className="text-3xl font-bold tracking-tight">R$99</span>
                <span className="ml-1 text-xl font-semibold">/mês</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Para empresas em crescimento que precisam de mais recursos.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>3 chatbots personalizados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Até 2.000 mensagens/mês</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Base de conhecimento avançada</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Análise de desempenho</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto p-6">
              <Button asChild className="w-full">
                <Link href="/login">Começar agora</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background shadow-sm">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Empresarial</h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                <span className="text-3xl font-bold tracking-tight">R$249</span>
                <span className="ml-1 text-xl font-semibold">/mês</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Para grandes empresas com necessidades avançadas.</p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>10 chatbots personalizados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Mensagens ilimitadas</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Base de conhecimento premium</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Suporte 24/7</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Análise avançada e relatórios</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>API personalizada</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto p-6">
              <Button asChild className="w-full">
                <Link href="/login">Começar agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
