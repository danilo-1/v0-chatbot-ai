import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Limpar planos existentes
  await prisma.plan.deleteMany({})

  // Criar planos
  const plans = [
    {
      name: "Student",
      description: "Ideal para estudantes e uso pessoal",
      price: 29.9,
      maxChatbots: 2,
      maxMessagesPerMonth: 1000,
      features: [
        "2 chatbots personalizados",
        "1.000 mensagens/mês",
        "Base de conhecimento básica",
        "Suporte por email",
        "Personalização básica",
      ],
    },
    {
      name: "Team",
      description: "Perfeito para equipes e pequenas empresas",
      price: 99.9,
      maxChatbots: 5,
      maxMessagesPerMonth: 5000,
      features: [
        "5 chatbots personalizados",
        "5.000 mensagens/mês",
        "Base de conhecimento avançada",
        "Suporte prioritário",
        "Personalização completa",
        "Análise de desempenho",
        "Integração com websites",
      ],
    },
    {
      name: "Company",
      description: "Para empresas com necessidades avançadas",
      price: 249.9,
      maxChatbots: 15,
      maxMessagesPerMonth: 20000,
      features: [
        "15 chatbots personalizados",
        "20.000 mensagens/mês",
        "Base de conhecimento premium",
        "Suporte 24/7",
        "Personalização completa",
        "Análise avançada e relatórios",
        "API personalizada",
        "Treinamento personalizado",
        "Gerenciamento de equipe",
      ],
    },
  ]

  for (const plan of plans) {
    await prisma.plan.create({
      data: plan,
    })
  }

  console.log("Planos inicializados com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
