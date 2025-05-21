import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const chatbotId = params.id

  // Verificar se o chatbot existe e é público
  const chatbot = await db.query(
    `
    SELECT * FROM "Chatbot" 
    WHERE id = $1 AND "isPublic" = true
  `,
    [chatbotId],
  )

  if (!chatbot || chatbot.length === 0) {
    return new NextResponse("Chatbot not found", { status: 404 })
  }

  // Gerar o script do widget
  const widgetScript = `
    (function() {
      // Configurações do widget
      const chatbotId = "${chatbotId}";
      const script = document.currentScript;
      const position = script.getAttribute("data-position") || "bottom-right";
      const theme = script.getAttribute("data-theme") || "light";
      const initialMessage = script.getAttribute("data-initial-message") || "Como posso ajudar?";
      
      // URL base da aplicação
      const baseUrl = "${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}";
      
      // Criar o botão do widget
      const createWidgetButton = () => {
        const button = document.createElement("div");
        button.id = "chatbot-widget-button";
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
        
        // Estilo do botão
        button.style.position = "fixed";
        button.style.width = "60px";
        button.style.height = "60px";
        button.style.borderRadius = "50%";
        button.style.backgroundColor = theme === "dark" ? "#1e293b" : "#3b82f6";
        button.style.color = "white";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        button.style.zIndex = "9999";
        
        // Posicionamento
        if (position === "bottom-right") {
          button.style.bottom = "20px";
          button.style.right = "20px";
        } else if (position === "bottom-left") {
          button.style.bottom = "20px";
          button.style.left = "20px";
        } else if (position === "top-right") {
          button.style.top = "20px";
          button.style.right = "20px";
        } else if (position === "top-left") {
          button.style.top = "20px";
          button.style.left = "20px";
        }
        
        return button;
      };
      
      // Criar o container do chat
      const createChatContainer = () => {
        const container = document.createElement("div");
        container.id = "chatbot-widget-container";
        
        // Estilo do container
        container.style.position = "fixed";
        container.style.width = "350px";
        container.style.height = "500px";
        container.style.backgroundColor = theme === "dark" ? "#1e293b" : "white";
        container.style.borderRadius = "8px";
        container.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        container.style.zIndex = "10000";
        container.style.overflow = "hidden";
        container.style.display = "none";
        
        // Posicionamento
        if (position === "bottom-right") {
          container.style.bottom = "90px";
          container.style.right = "20px";
        } else if (position === "bottom-left") {
          container.style.bottom = "90px";
          container.style.left = "20px";
        } else if (position === "top-right") {
          container.style.top = "90px";
          container.style.right = "20px";
        } else if (position === "top-left") {
          container.style.top = "90px";
          container.style.left = "20px";
        }
        
        // Criar iframe para o chat
        const iframe = document.createElement("iframe");
        iframe.src = \`\${baseUrl}/embed/\${chatbotId}?theme=\${theme}&initialMessage=\${encodeURIComponent(initialMessage)}&referrer=\${encodeURIComponent(window.location.href)}\`;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        
        container.appendChild(iframe);
        return container;
      };
      
      // Adicionar elementos ao DOM
      const init = () => {
        const button = createWidgetButton();
        const container = createChatContainer();
        
        document.body.appendChild(button);
        document.body.appendChild(container);
        
        // Toggle do chat ao clicar no botão
        button.addEventListener("click", () => {
          if (container.style.display === "none") {
            container.style.display = "block";
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
          } else {
            container.style.display = "none";
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
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
    },
  })
}
