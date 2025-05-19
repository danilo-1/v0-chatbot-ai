import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Perguntas Frequentes</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tire suas dúvidas</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como funciona o chatbot?</AccordionTrigger>
              <AccordionContent>
                Nosso chatbot utiliza inteligência artificial avançada para entender e responder perguntas dos usuários.
                Ele é treinado com informações específicas do seu negócio para fornecer respostas precisas e relevantes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Quanto tempo leva para configurar um chatbot?</AccordionTrigger>
              <AccordionContent>
                A configuração básica pode ser feita em minutos. Para um chatbot mais personalizado com uma base de
                conhecimento completa, recomendamos dedicar algumas horas para alimentá-lo com informações relevantes do
                seu negócio.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Posso personalizar a aparência do chatbot?</AccordionTrigger>
              <AccordionContent>
                Sim, você pode personalizar cores, ícones, fontes e outros elementos visuais para que o chatbot se
                alinhe à identidade visual da sua marca.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Como integro o chatbot ao meu site?</AccordionTrigger>
              <AccordionContent>
                A integração é simples e pode ser feita adicionando um pequeno trecho de código ao seu site. Fornecemos
                instruções detalhadas e suporte para ajudar nesse processo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>O chatbot funciona em dispositivos móveis?</AccordionTrigger>
              <AccordionContent>
                Sim, nosso chatbot é totalmente responsivo e funciona perfeitamente em smartphones, tablets e desktops.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Posso exportar as conversas dos usuários?</AccordionTrigger>
              <AccordionContent>
                Sim, você pode exportar as conversas para análise e melhorar continuamente seu chatbot e estratégias de
                atendimento.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
