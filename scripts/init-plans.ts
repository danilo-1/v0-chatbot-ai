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
      price: 2990, // R$ 29,90
      messageLimit: 1000,
      chatbotLimit: 2,
      features: ["Personalização básica", "Integração com site", "Suporte por email"],
    },
    {
      name: "Team",
      description: "Perfeito para equipes e pequenas empresas",
      price: 9990, // R$ 99,90
      messageLimit: 5000,
      chatbotLimit: 5,
      features: ["Personalização avançada", "Análise de conversas", "Múltiplos usuários", "Suporte prioritário"],
    },
    {
      name: "Company",
      description: "Solução completa para empresas",
      price: 24990, // R$ 249,90
      messageLimit: 20000,
      chatbotLimit: 15,
      features: [
        "Personalização total",
        "API avançada",
        "Integrações premium",
        "Suporte 24/7",
        "Treinamento personalizado",
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
