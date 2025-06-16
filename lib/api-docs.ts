export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  title: string
  description: string
  tags: string[]
  auth?: boolean
  parameters?: Parameter[]
  requestBody?: RequestBody
  responses: Response[]
  examples?: Example[]
}

export interface Parameter {
  name: string
  in: "path" | "query" | "header"
  required: boolean
  type: string
  description: string
  example?: any
}

export interface RequestBody {
  description: string
  required: boolean
  content: {
    [contentType: string]: {
      schema: any
      example?: any
    }
  }
}

export interface Response {
  status: number
  description: string
  content?: {
    [contentType: string]: {
      schema: any
      example?: any
    }
  }
}

export interface Example {
  title: string
  description: string
  request?: any
  response?: any
}

export const apiEndpoints: ApiEndpoint[] = [
  // Chatbots
  {
    method: "GET",
    path: "/api/chatbots",
    title: "Listar Chatbots",
    description: "Retorna todos os chatbots do usuário autenticado",
    tags: ["Chatbots"],
    auth: true,
    responses: [
      {
        status: 200,
        description: "Lista de chatbots retornada com sucesso",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/Chatbot" },
            },
            example: [
              {
                id: "chatbot_123",
                name: "Assistente de Vendas",
                description: "Chatbot para auxiliar nas vendas",
                model: "gpt-4",
                isPublic: false,
                createdAt: "2024-01-15T10:30:00Z",
              },
            ],
          },
        },
      },
    ],
  },
  {
    method: "POST",
    path: "/api/chatbots",
    title: "Criar Chatbot",
    description: "Cria um novo chatbot",
    tags: ["Chatbots"],
    auth: true,
    requestBody: {
      description: "Dados do chatbot a ser criado",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "description"],
            properties: {
              name: { type: "string", description: "Nome do chatbot" },
              description: { type: "string", description: "Descrição do chatbot" },
              instructions: { type: "string", description: "Instruções para o chatbot" },
              model: { type: "string", description: "Modelo de IA", default: "gpt-3.5-turbo" },
              temperature: { type: "number", minimum: 0, maximum: 2, default: 0.7 },
              maxTokens: { type: "integer", minimum: 1, default: 1000 },
              isPublic: { type: "boolean", default: false },
            },
          },
          example: {
            name: "Assistente de Suporte",
            description: "Chatbot para atendimento ao cliente",
            instructions: "Você é um assistente prestativo que ajuda clientes com dúvidas sobre produtos.",
            model: "gpt-4",
            temperature: 0.7,
            maxTokens: 1500,
            isPublic: false,
          },
        },
      },
    },
    responses: [
      {
        status: 201,
        description: "Chatbot criado com sucesso",
        content: {
          "application/json": {
            example: {
              id: "chatbot_456",
              name: "Assistente de Suporte",
              description: "Chatbot para atendimento ao cliente",
              userId: "user_123",
              createdAt: "2024-01-15T11:00:00Z",
            },
          },
        },
      },
    ],
  },
  {
    method: "POST",
    path: "/api/chatbots/{id}/chat",
    title: "Conversar com Chatbot",
    description: "Envia uma mensagem para o chatbot e recebe a resposta",
    tags: ["Chat"],
    auth: true,
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        type: "string",
        description: "ID do chatbot",
        example: "chatbot_123",
      },
    ],
    requestBody: {
      description: "Mensagem a ser enviada",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["message"],
            properties: {
              message: { type: "string", description: "Mensagem do usuário" },
              sessionId: { type: "string", description: "ID da sessão (opcional)" },
            },
          },
          example: {
            message: "Olá! Como você pode me ajudar?",
            sessionId: "session_789",
          },
        },
      },
    },
    responses: [
      {
        status: 200,
        description: "Resposta do chatbot",
        content: {
          "application/json": {
            example: {
              response:
                "Olá! Eu sou seu assistente virtual. Posso ajudá-lo com informações sobre nossos produtos e serviços. Em que posso ajudá-lo hoje?",
              sessionId: "session_789",
              usage: {
                promptTokens: 45,
                completionTokens: 32,
                totalTokens: 77,
              },
            },
          },
        },
      },
    ],
  },
  // Auth
  {
    method: "GET",
    path: "/api/auth/user",
    title: "Informações do Usuário",
    description: "Retorna informações do usuário autenticado",
    tags: ["Autenticação"],
    auth: true,
    responses: [
      {
        status: 200,
        description: "Informações do usuário",
        content: {
          "application/json": {
            example: {
              id: "user_123",
              name: "João Silva",
              email: "joao@exemplo.com",
              image: "https://exemplo.com/avatar.jpg",
              role: "USER",
              createdAt: "2024-01-01T00:00:00Z",
            },
          },
        },
      },
    ],
  },
  // Health
  {
    method: "GET",
    path: "/api/health",
    title: "Status da API",
    description: "Verifica se a API está funcionando corretamente",
    tags: ["Sistema"],
    auth: false,
    responses: [
      {
        status: 200,
        description: "API funcionando normalmente",
        content: {
          "application/json": {
            example: {
              status: "ok",
              timestamp: "2024-01-15T12:00:00Z",
              version: "1.0.0",
              uptime: 3600,
            },
          },
        },
      },
    ],
  },
  // Admin
  {
    method: "GET",
    path: "/api/admin/ai-models",
    title: "Listar Modelos de IA",
    description: "Retorna todos os modelos de IA disponíveis (Admin)",
    tags: ["Admin"],
    auth: true,
    responses: [
      {
        status: 200,
        description: "Lista de modelos de IA",
        content: {
          "application/json": {
            example: [
              {
                id: "model_1",
                name: "GPT-4",
                provider: "OpenAI",
                modelId: "gpt-4",
                maxTokens: 8192,
                isDefault: true,
                isActive: true,
              },
            ],
          },
        },
      },
    ],
  },
]

export const apiTags = [
  { name: "Chatbots", description: "Gerenciamento de chatbots", color: "blue" },
  { name: "Chat", description: "Conversas com chatbots", color: "green" },
  { name: "Autenticação", description: "Autenticação e usuários", color: "purple" },
  { name: "Admin", description: "Endpoints administrativos", color: "red" },
  { name: "Sistema", description: "Status e informações do sistema", color: "gray" },
]
