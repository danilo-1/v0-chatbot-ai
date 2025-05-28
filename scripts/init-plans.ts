import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando seed de planos...")

  // Verificar se já existem planos
  const existingPlans = await prisma.plan.findMany()
  if (existingPlans.length > 0) {
    console.log(`${existingPlans.length} planos já existem. Pulando criação.`)
    return
  }

  // Criar plano gratuito
  await prisma.plan.create({
    data: {
      name: "Free",
      description: "Plano gratuito para experimentar a plataforma",
      price: 0,
      currency: "BRL",
      interval: "month",
      maxChatbots: 1,
      maxMessagesPerMonth: 50,
      isFree: true,
      features: ["1 chatbot", "50 mensagens por mês", "Conhecimento base limitado", "Suporte por email"],
    },
  })

  // Criar plano básico
  await prisma.plan.create({
    data: {
      name: "Básico",
      description: "Ideal para pequenos negócios",
      price: 29.9,
      currency: "BRL",
      interval: "month",
      maxChatbots: 3,
      maxMessagesPerMonth: 1000,
      features: [
        "3 chatbots",
        "1.000 mensagens por mês",
        "Conhecimento base ilimitado",
        "Suporte prioritário",
        "Personalização de aparência",
      ],
    },
  })

  // Criar plano profissional
  await prisma.plan.create({
    data: {
      name: "Profissional",
      description: "Para empresas em crescimento",
      price: 79.9,
      currency: "BRL",
      interval: "month",
      maxChatbots: 10,
      maxMessagesPerMonth: 5000,
      features: [
        "10 chatbots",
        "5.000 mensagens por mês",
        "Conhecimento base ilimitado",
        "Suporte prioritário 24/7",
        "Personalização completa",
        "Análise avançada de conversas",
        "Integração com CRM",
      ],
    },
  })

  // Criar plano empresarial
  await prisma.plan.create({
    data: {
      name: "Empresarial",
      description: "Para grandes empresas",
      price: 199.9,
      currency: "BRL",
      interval: "month",
      maxChatbots: 50,
      maxMessagesPerMonth: 20000,
      features: [
        "50 chatbots",
        "20.000 mensagens por mês",
        "Conhecimento base ilimitado",
        "Suporte dedicado 24/7",
        "Personalização completa",
        "Análise avançada de conversas",
        "Integração com CRM",
        "API dedicada",
        "SLA garantido",
      ],
    },
  })

  console.log("Planos criados com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
