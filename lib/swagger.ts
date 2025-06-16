import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chatbot AI API",
      version: "1.0.0",
      description: "API completa para gerenciamento de chatbots com IA",
      contact: {
        name: "Chatbot AI Support",
        email: "support@chatbot-ai.com",
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "next-auth.session-token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID único do usuário" },
            name: { type: "string", description: "Nome do usuário" },
            email: { type: "string", format: "email", description: "Email do usuário" },
            image: { type: "string", description: "URL da imagem do usuário" },
            role: { type: "string", enum: ["USER", "ADMIN"], description: "Papel do usuário" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Chatbot: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID único do chatbot" },
            name: { type: "string", description: "Nome do chatbot" },
            description: { type: "string", description: "Descrição do chatbot" },
            instructions: { type: "string", description: "Instruções para o chatbot" },
            model: { type: "string", description: "Modelo de IA utilizado" },
            temperature: { type: "number", minimum: 0, maximum: 2, description: "Temperatura do modelo" },
            maxTokens: { type: "integer", minimum: 1, description: "Máximo de tokens por resposta" },
            isPublic: { type: "boolean", description: "Se o chatbot é público" },
            userId: { type: "string", description: "ID do usuário proprietário" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ChatMessage: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID único da mensagem" },
            content: { type: "string", description: "Conteúdo da mensagem" },
            role: { type: "string", enum: ["user", "assistant"], description: "Papel do remetente" },
            chatbotId: { type: "string", description: "ID do chatbot" },
            sessionId: { type: "string", description: "ID da sessão" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AIModel: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID único do modelo" },
            name: { type: "string", description: "Nome do modelo" },
            provider: { type: "string", description: "Provedor do modelo" },
            modelId: { type: "string", description: "ID do modelo no provedor" },
            maxTokens: { type: "integer", description: "Máximo de tokens suportados" },
            isDefault: { type: "boolean", description: "Se é o modelo padrão" },
            isActive: { type: "boolean", description: "Se o modelo está ativo" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", description: "Mensagem de erro" },
            code: { type: "string", description: "Código do erro" },
            details: { type: "object", description: "Detalhes adicionais do erro" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", description: "Indica se a operação foi bem-sucedida" },
            message: { type: "string", description: "Mensagem de sucesso" },
            data: { type: "object", description: "Dados retornados" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }, { sessionAuth: [] }],
  },
  apis: ["./app/api/**/*.ts", "./app/api/**/*.js"],
}

export const swaggerSpec = swaggerJsdoc(options)
