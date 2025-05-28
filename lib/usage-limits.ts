import prisma from "@/prisma/client"

// Limites padrão para usuários sem assinatura
const DEFAULT_FREE_LIMITS = {
  maxChatbots: 1,
  maxMessagesPerMonth: 50,
}

export async function getUserLimits(userId: string) {
  try {
    // Verificar se o usuário tem uma assinatura ativa
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
        currentPeriodEnd: {
          gte: new Date(),
        },
      },
      include: {
        plan: true,
      },
    })

    // Se não tiver assinatura, verificar se existe um plano gratuito
    if (!subscription) {
      const freePlan = await prisma.plan.findFirst({
        where: {
          isFree: true,
        },
      })

      return freePlan || DEFAULT_FREE_LIMITS
    }

    return subscription.plan
  } catch (error) {
    console.error("Erro ao obter limites do usuário:", error)
    return DEFAULT_FREE_LIMITS
  }
}

export async function getUserUsage(userId: string) {
  try {
    // Obter ou criar estatísticas de uso
    let usageStats = await prisma.userUsageStats.findUnique({
      where: {
        userId,
      },
    })

    if (!usageStats) {
      usageStats = await prisma.userUsageStats.create({
        data: {
          userId,
          messageCount: 0,
          chatbotCount: 0,
          lastResetDate: new Date(),
        },
      })
    }

    // Verificar se precisa resetar as estatísticas (novo mês)
    const lastReset = new Date(usageStats.lastResetDate)
    const now = new Date()

    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      usageStats = await prisma.userUsageStats.update({
        where: {
          id: usageStats.id,
        },
        data: {
          messageCount: 0,
          lastResetDate: now,
        },
      })
    }

    // Contar chatbots atuais
    const chatbotCount = await prisma.chatbot.count({
      where: {
        userId,
      },
    })

    return {
      messageCount: usageStats.messageCount,
      chatbotCount,
    }
  } catch (error) {
    console.error("Erro ao obter uso do usuário:", error)
    return {
      messageCount: 0,
      chatbotCount: 0,
    }
  }
}

export async function incrementMessageCount(userId: string) {
  try {
    // Verificar se o usuário tem estatísticas
    const usageStats = await prisma.userUsageStats.findUnique({
      where: {
        userId,
      },
    })

    if (usageStats) {
      // Incrementar contagem de mensagens
      await prisma.userUsageStats.update({
        where: {
          id: usageStats.id,
        },
        data: {
          messageCount: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
      })
    } else {
      // Criar estatísticas se não existirem
      await prisma.userUsageStats.create({
        data: {
          userId,
          messageCount: 1,
          chatbotCount: 0,
          lastResetDate: new Date(),
        },
      })
    }
  } catch (error) {
    console.error("Erro ao incrementar contagem de mensagens:", error)
  }
}

export async function checkUserLimits(userId: string) {
  try {
    const [limits, usage] = await Promise.all([getUserLimits(userId), getUserUsage(userId)])

    const isWithinMessageLimit = usage.messageCount < limits.maxMessagesPerMonth
    const isWithinChatbotLimit = usage.chatbotCount < limits.maxChatbots

    return {
      isWithinLimits: isWithinMessageLimit && isWithinChatbotLimit,
      isWithinMessageLimit,
      isWithinChatbotLimit,
      messageCount: usage.messageCount,
      chatbotCount: usage.chatbotCount,
      messageLimit: limits.maxMessagesPerMonth,
      chatbotLimit: limits.maxChatbots,
      percentageUsed: Math.round((usage.messageCount / limits.maxMessagesPerMonth) * 100),
    }
  } catch (error) {
    console.error("Erro ao verificar limites do usuário:", error)
    return {
      isWithinLimits: false,
      isWithinMessageLimit: false,
      isWithinChatbotLimit: false,
      messageCount: 0,
      chatbotCount: 0,
      messageLimit: 0,
      chatbotLimit: 0,
      percentageUsed: 0,
    }
  }
}

export async function assignFreePlanToUser(userId: string) {
  try {
    // Verificar se o usuário já tem uma assinatura
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
      },
    })

    if (existingSubscription) {
      return existingSubscription
    }

    // Buscar o plano gratuito
    const freePlan = await prisma.plan.findFirst({
      where: {
        isFree: true,
      },
    })

    if (!freePlan) {
      throw new Error("Plano gratuito não encontrado")
    }

    // Criar assinatura para o plano gratuito
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 10) // Validade longa para plano gratuito

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: freePlan.id,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: endDate,
      },
    })

    return subscription
  } catch (error) {
    console.error("Erro ao atribuir plano gratuito:", error)
    throw error
  }
}
