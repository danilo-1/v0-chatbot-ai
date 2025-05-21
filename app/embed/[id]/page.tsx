import { notFound } from "next/navigation"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { theme?: string; initialMessage?: string; referrer?: string }
}) {
  const chatbotId = params.id
  const theme = searchParams.theme || "light"
  const initialMessage = searchParams.initialMessage || "Como posso ajudar?"
  const referrer = searchParams.referrer || ""

  try {
    // Usar o cliente neon diretamente
    const sql = neon(process.env.DATABASE_URL!)

    // Verificar se o chatbot existe e é público
    const chatbot = await sql`
      SELECT * FROM "Chatbot" 
      WHERE id = ${chatbotId} AND "isPublic" = true
    `

    if (!chatbot || chatbot.length === 0) {
      return notFound()
    }

    const chatbotData = chatbot[0]

    return (
      <html lang="pt-BR" className={theme === "dark" ? "dark" : ""}>
        <head>
          <title>Chat com {chatbotData.name}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' http: https: data:" />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            :root {
              --background: ${theme === "dark" ? "#1e293b" : "#ffffff"};
              --foreground: ${theme === "dark" ? "#f8fafc" : "#0f172a"};
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: var(--background);
              color: var(--foreground);
              height: 100vh;
              width: 100vw;
              overflow: hidden;
            }
            
            .chat-container {
              display: flex;
              flex-direction: column;
              height: 100vh;
              width: 100vw;
            }
            
            .chat-header {
              padding: 12px 16px;
              background-color: ${theme === "dark" ? "#0f172a" : "#f8fafc"};
              border-bottom: 1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"};
              display: flex;
              align-items: center;
            }
            
            .chat-header h1 {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
            }
            
            .chat-messages {
              flex: 1;
              overflow-y: auto;
              padding: 16px;
            }
            
            .chat-input {
              padding: 12px 16px;
              background-color: ${theme === "dark" ? "#0f172a" : "#f8fafc"};
              border-top: 1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"};
            }
            
            .chat-input form {
              display: flex;
              gap: 8px;
            }
            
            .chat-input input {
              flex: 1;
              padding: 8px 12px;
              border-radius: 4px;
              border: 1px solid ${theme === "dark" ? "#475569" : "#cbd5e1"};
              background-color: ${theme === "dark" ? "#1e293b" : "#ffffff"};
              color: var(--foreground);
            }
            
            .chat-input button {
              padding: 8px 16px;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            
            .message {
              margin-bottom: 12px;
              max-width: 80%;
              padding: 8px 12px;
              border-radius: 8px;
            }
            
            .user-message {
              background-color: #3b82f6;
              color: white;
              align-self: flex-end;
              margin-left: auto;
            }
            
            .bot-message {
              background-color: ${theme === "dark" ? "#334155" : "#e2e8f0"};
              color: var(--foreground);
              align-self: flex-start;
            }
          `,
            }}
          />
        </head>
        <body>
          <div className="chat-container">
            <div className="chat-header">
              <h1>{chatbotData.name}</h1>
            </div>
            <div className="chat-messages" id="chat-messages">
              <div className="message bot-message">{initialMessage}</div>
            </div>
            <div className="chat-input">
              <form id="chat-form">
                <input type="text" id="message-input" placeholder="Digite sua mensagem..." autoComplete="off" />
                <button type="submit">Enviar</button>
              </form>
            </div>
          </div>

          <script
            dangerouslySetInnerHTML={{
              __html: `
            const chatForm = document.getElementById('chat-form');
            const messageInput = document.getElementById('message-input');
            const chatMessages = document.getElementById('chat-messages');
            
            chatForm.addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const message = messageInput.value.trim();
              if (!message) return;
              
              // Adicionar mensagem do usuário
              const userMessageEl = document.createElement('div');
              userMessageEl.className = 'message user-message';
              userMessageEl.textContent = message;
              chatMessages.appendChild(userMessageEl);
              
              // Limpar input
              messageInput.value = '';
              
              // Rolar para o final
              chatMessages.scrollTop = chatMessages.scrollHeight;
              
              try {
                // Enviar mensagem para a API
                const response = await fetch('https://v0-chatbot-ai-kf.vercel.app/api/chatbots/${chatbotId}/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    messages: [{ role: 'user', content: message }],
                    referrer: '${referrer}'
                  }),
                });
                
                if (!response.ok) {
                  throw new Error('Erro ao enviar mensagem');
                }
                
                const data = await response.json();
                
                // Adicionar resposta do bot
                const botMessageEl = document.createElement('div');
                botMessageEl.className = 'message bot-message';
                botMessageEl.textContent = data.message || data.content || 'Desculpe, ocorreu um erro.';
                chatMessages.appendChild(botMessageEl);
                
                // Rolar para o final
                chatMessages.scrollTop = chatMessages.scrollHeight;
              } catch (error) {
                console.error('Erro:', error);
                
                // Adicionar mensagem de erro
                const errorMessageEl = document.createElement('div');
                errorMessageEl.className = 'message bot-message';
                errorMessageEl.textContent = 'Desculpe, ocorreu um erro ao processar sua mensagem.';
                chatMessages.appendChild(errorMessageEl);
                
                // Rolar para o final
                chatMessages.scrollTop = chatMessages.scrollHeight;
              }
            });
          `,
            }}
          />
        </body>
      </html>
    )
  } catch (error) {
    console.error("Erro ao carregar chatbot para embed:", error)
    return (
      <html>
        <head>
          <title>Erro</title>
          <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' http: https: data:" />
        </head>
        <body
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            margin: 0,
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ color: "#e11d48" }}>Erro</h1>
            <p>Não foi possível carregar o chatbot. Por favor, tente novamente mais tarde.</p>
          </div>
        </body>
      </html>
    )
  }
}
