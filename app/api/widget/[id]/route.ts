import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const chatbotId = params.id

  try {
    // Usar o cliente neon diretamente
    const sql = neon(process.env.DATABASE_URL!)

    // Verificar se o chatbot existe e é público
    const chatbot = await sql`
      SELECT * FROM "Chatbot" 
      WHERE id = ${chatbotId} AND "isPublic" = true
    `

    if (!chatbot || chatbot.length === 0) {
      return new NextResponse("Chatbot not found", { status: 404 })
    }

    const chatbotData = chatbot[0]
    const chatbotName = chatbotData.name || "Assistente"
    const chatbotImageUrl = chatbotData.imageUrl || ""

    // URL base correta da aplicação
    const baseUrl = "https://v0-chatbot-ai-kf.vercel.app"

    // Gerar o script do widget
    const widgetScript = `
      (function() {
        // Configurações do widget
        const chatbotId = "${chatbotId}";
        const chatbotName = "${chatbotName}";
        const chatbotImageUrl = "${chatbotImageUrl}";
        const script = document.currentScript;
        const position = script.getAttribute("data-position") || "bottom-right";
        const theme = script.getAttribute("data-theme") || "light";
        const initialMessage = script.getAttribute("data-initial-message") || "Como posso ajudar?";
        
        // URL base da aplicação
        const baseUrl = "${baseUrl}";
        
        // Estilos do widget
        const addStyles = () => {
          const styleEl = document.createElement('style');
          styleEl.textContent = \`
            #chatbot-widget-button {
              position: fixed;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: \${theme === "dark" ? "#1e293b" : "#3b82f6"};
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              z-index: 9999;
              \${position === "bottom-right" ? "bottom: 20px; right: 20px;" : ""}
              \${position === "bottom-left" ? "bottom: 20px; left: 20px;" : ""}
              \${position === "top-right" ? "top: 20px; right: 20px;" : ""}
              \${position === "top-left" ? "top: 20px; left: 20px;" : ""}
            }
            
            #chatbot-widget-container {
              position: fixed;
              width: 350px;
              height: 500px;
              background-color: \${theme === "dark" ? "#1e293b" : "white"};
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              z-index: 10000;
              overflow: hidden;
              display: none;
              flex-direction: column;
              \${position === "bottom-right" ? "bottom: 90px; right: 20px;" : ""}
              \${position === "bottom-left" ? "bottom: 90px; left: 20px;" : ""}
              \${position === "top-right" ? "top: 90px; right: 20px;" : ""}
              \${position === "top-left" ? "top: 90px; left: 20px;" : ""}
            }
            
            #chatbot-widget-header {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              background-color: \${theme === "dark" ? "#0f172a" : "#f8fafc"};
              border-bottom: 1px solid \${theme === "dark" ? "#1e293b" : "#e2e8f0"};
            }
            
            #chatbot-widget-avatar {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background-color: \${theme === "dark" ? "#334155" : "#e2e8f0"};
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
              overflow: hidden;
            }
            
            #chatbot-widget-avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            #chatbot-widget-title {
              flex: 1;
              font-weight: 600;
              color: \${theme === "dark" ? "#f8fafc" : "#0f172a"};
            }
            
            #chatbot-widget-close {
              cursor: pointer;
              color: \${theme === "dark" ? "#94a3b8" : "#64748b"};
            }
            
            #chatbot-widget-messages {
              flex: 1;
              overflow-y: auto;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
              background-color: \${theme === "dark" ? "#0f172a" : "#f8fafc"};
            }
            
            .chatbot-widget-message {
              max-width: 80%;
              padding: 10px 14px;
              border-radius: 8px;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .chatbot-widget-message.user {
              align-self: flex-end;
              background-color: #3b82f6;
              color: white;
            }
            
            .chatbot-widget-message.assistant {
              align-self: flex-start;
              background-color: \${theme === "dark" ? "#1e293b" : "#e2e8f0"};
              color: \${theme === "dark" ? "#f8fafc" : "#0f172a"};
            }
            
            #chatbot-widget-input-container {
              display: flex;
              padding: 12px 16px;
              border-top: 1px solid \${theme === "dark" ? "#1e293b" : "#e2e8f0"};
              background-color: \${theme === "dark" ? "#0f172a" : "#f8fafc"};
            }
            
            #chatbot-widget-input {
              flex: 1;
              border: 1px solid \${theme === "dark" ? "#334155" : "#cbd5e1"};
              border-radius: 4px;
              padding: 8px 12px;
              background-color: \${theme === "dark" ? "#1e293b" : "white"};
              color: \${theme === "dark" ? "#f8fafc" : "#0f172a"};
              outline: none;
            }
            
            #chatbot-widget-send {
              margin-left: 8px;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 4px;
              padding: 8px 12px;
              cursor: pointer;
            }
            
            #chatbot-widget-loading {
              display: none;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            
            .chatbot-widget-dot {
              width: 8px;
              height: 8px;
              background-color: \${theme === "dark" ? "#94a3b8" : "#64748b"};
              border-radius: 50%;
              margin: 0 4px;
              animation: chatbot-widget-pulse 1.5s infinite ease-in-out;
            }
            
            .chatbot-widget-dot:nth-child(2) {
              animation-delay: 0.2s;
            }
            
            .chatbot-widget-dot:nth-child(3) {
              animation-delay: 0.4s;
            }
            
            @keyframes chatbot-widget-pulse {
              0%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
              }
              50% {
                transform: scale(1.2);
                opacity: 1;
              }
            }
            
            @media (max-width: 480px) {
              #chatbot-widget-container {
                width: calc(100vw - 40px);
                height: 70vh;
              }
            }
          \`;
          document.head.appendChild(styleEl);
        };
        
        // Criar o botão do widget
        const createWidgetButton = () => {
          const button = document.createElement("div");
          button.id = "chatbot-widget-button";
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
          return button;
        };
        
        // Criar o container do chat
        const createChatContainer = () => {
          const container = document.createElement("div");
          container.id = "chatbot-widget-container";
          
          // Header
          const header = document.createElement("div");
          header.id = "chatbot-widget-header";
          
          const avatar = document.createElement("div");
          avatar.id = "chatbot-widget-avatar";
          if (chatbotImageUrl) {
            const img = document.createElement("img");
            img.src = chatbotImageUrl;
            img.alt = chatbotName;
            avatar.appendChild(img);
          } else {
            avatar.textContent = chatbotName.charAt(0).toUpperCase();
          }
          
          const title = document.createElement("div");
          title.id = "chatbot-widget-title";
          title.textContent = chatbotName;
          
          const closeButton = document.createElement("div");
          closeButton.id = "chatbot-widget-close";
          closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
          
          header.appendChild(avatar);
          header.appendChild(title);
          header.appendChild(closeButton);
          
          // Messages container
          const messagesContainer = document.createElement("div");
          messagesContainer.id = "chatbot-widget-messages";
          
          // Loading indicator
          const loadingIndicator = document.createElement("div");
          loadingIndicator.id = "chatbot-widget-loading";
          for (let i = 0; i < 3; i++) {
            const dot = document.createElement("div");
            dot.className = "chatbot-widget-dot";
            loadingIndicator.appendChild(dot);
          }
          
          // Input container
          const inputContainer = document.createElement("div");
          inputContainer.id = "chatbot-widget-input-container";
          
          const input = document.createElement("input");
          input.id = "chatbot-widget-input";
          input.type = "text";
          input.placeholder = "Digite sua mensagem...";
          
          const sendButton = document.createElement("button");
          sendButton.id = "chatbot-widget-send";
          sendButton.textContent = "Enviar";
          
          inputContainer.appendChild(input);
          inputContainer.appendChild(sendButton);
          
          // Append all elements to container
          container.appendChild(header);
          container.appendChild(messagesContainer);
          container.appendChild(loadingIndicator);
          container.appendChild(inputContainer);
          
          return container;
        };
        
        // Adicionar mensagem ao chat
        const addMessage = (content, role) => {
          const messagesContainer = document.getElementById("chatbot-widget-messages");
          const messageEl = document.createElement("div");
          messageEl.className = \`chatbot-widget-message \${role}\`;
          messageEl.textContent = content;
          messagesContainer.appendChild(messageEl);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };
        
        // Mostrar indicador de carregamento
        const showLoading = (show) => {
          const loadingIndicator = document.getElementById("chatbot-widget-loading");
          loadingIndicator.style.display = show ? "flex" : "none";
        };
        
        // Enviar mensagem para o chatbot
        const sendMessage = async (message) => {
          if (!message.trim()) return;
          
          // Adicionar mensagem do usuário
          addMessage(message, "user");
          
          // Limpar input
          document.getElementById("chatbot-widget-input").value = "";
          
          // Mostrar loading
          showLoading(true);
          
          try {
            // Usar o endpoint original do chatbot que já funciona
            const response = await fetch(\`\${baseUrl}/api/chatbots/\${chatbotId}/chat\`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [{ role: "user", content: message }]
              })
            });
            
            if (!response.ok) {
              throw new Error("Erro ao enviar mensagem");
            }
            
            const data = await response.json();
            
            // Adicionar resposta do assistente
            addMessage(data.content || data.message || "Desculpe, ocorreu um erro.", "assistant");
          } catch (error) {
            console.error("Erro:", error);
            addMessage("Desculpe, ocorreu um erro ao processar sua mensagem.", "assistant");
          } finally {
            // Esconder loading
            showLoading(false);
          }
        };
        
        // Adicionar elementos ao DOM e configurar eventos
        const init = () => {
          // Adicionar estilos
          addStyles();
          
          // Criar elementos
          const button = createWidgetButton();
          const container = createChatContainer();
          
          // Adicionar ao DOM
          document.body.appendChild(button);
          document.body.appendChild(container);
          
          // Configurar eventos
          button.addEventListener("click", () => {
            container.style.display = "flex";
            button.style.display = "none";
            
            // Adicionar mensagem inicial se não houver mensagens
            const messagesContainer = document.getElementById("chatbot-widget-messages");
            if (!messagesContainer.hasChildNodes()) {
              addMessage(initialMessage, "assistant");
            }
          });
          
          document.getElementById("chatbot-widget-close").addEventListener("click", () => {
            container.style.display = "none";
            button.style.display = "flex";
          });
          
          document.getElementById("chatbot-widget-send").addEventListener("click", () => {
            const input = document.getElementById("chatbot-widget-input");
            sendMessage(input.value);
          });
          
          document.getElementById("chatbot-widget-input").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
              const input = document.getElementById("chatbot-widget-input");
              sendMessage(input.value);
            }
          });
        };
        
        // Inicializar quando o DOM estiver pronto
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", init);
        } else {
          init();
        }
      })();
    `

    return new NextResponse(widgetScript, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Erro ao gerar script de widget:", error)
    return new NextResponse("Error generating widget script", { status: 500 })
  }
}
