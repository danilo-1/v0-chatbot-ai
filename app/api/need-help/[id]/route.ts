import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const chatbotId = params.id

    // Verificar se o chatbot existe
    const chatbot = await db.chatbot.findUnique({
      where: { id: chatbotId },
      select: {
        id: true,
        name: true,
        avatar: true,
        primaryColor: true,
        userId: true,
      },
    })

    if (!chatbot) {
      return new NextResponse("Chatbot not found", { status: 404 })
    }

    // Registrar telemetria de carregamento do widget
    await db.chatbotTelemetry.create({
      data: {
        chatbotId,
        event: "NEED_HELP_WIDGET_LOADED",
        metadata: {
          url: request.headers.get("referer") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      },
    })

    // Gerar o script do widget
    const script = generateNeedHelpScript(chatbot)

    return new NextResponse(script, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error serving Need Help widget:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

function generateNeedHelpScript(chatbot: any) {
  return `
    (function() {
      // Configuração do widget
      const chatbotId = "${chatbot.id}";
      const apiUrl = "${process.env.NEXT_PUBLIC_APP_URL || ""}";
      
      // Obter configurações dos atributos de dados
      const scriptTag = document.currentScript;
      const mode = scriptTag.getAttribute('data-mode') || 'help';
      const position = scriptTag.getAttribute('data-position') || 'bottom-right';
      const theme = scriptTag.getAttribute('data-theme') || 'light';
      const buttonText = scriptTag.getAttribute('data-button-text') || 'Need Help?';
      const buttonIcon = scriptTag.getAttribute('data-button-icon') || 'question';
      const primaryColor = scriptTag.getAttribute('data-primary-color') || '${chatbot.primaryColor || "#7c3aed"}';
      const initialState = scriptTag.getAttribute('data-initial-state') || 'closed';
      const autoOpenDelay = scriptTag.getAttribute('data-auto-open-delay') || 'disabled';
      
      // Criar estilos
      const styles = document.createElement('style');
      styles.textContent = \`
        .need-help-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          position: fixed;
          z-index: 9999;
          transition: all 0.3s ease;
        }
        
        .need-help-widget.bottom-right {
          bottom: 20px;
          right: 20px;
        }
        
        .need-help-widget.bottom-left {
          bottom: 20px;
          left: 20px;
        }
        
        .need-help-widget.top-right {
          top: 20px;
          right: 20px;
        }
        
        .need-help-widget.top-left {
          top: 20px;
          left: 20px;
        }
        
        .need-help-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          border-radius: 50px;
          background-color: \${primaryColor};
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
          border: none;
          font-size: 14px;
          font-weight: 500;
        }
        
        .need-help-button:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }
        
        .need-help-icon {
          margin-right: 8px;
          width: 20px;
          height: 20px;
        }
        
        .need-help-panel {
          position: absolute;
          width: 360px;
          height: 520px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          opacity: 0;
          visibility: hidden;
          transform: scale(0.95);
        }
        
        .need-help-widget.bottom-right .need-help-panel {
          bottom: 70px;
          right: 0;
        }
        
        .need-help-widget.bottom-left .need-help-panel {
          bottom: 70px;
          left: 0;
        }
        
        .need-help-widget.top-right .need-help-panel {
          top: 70px;
          right: 0;
        }
        
        .need-help-widget.top-left .need-help-panel {
          top: 70px;
          left: 0;
        }
        
        .need-help-panel.open {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
        }
        
        .need-help-header {
          padding: 16px;
          background-color: \${primaryColor};
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .need-help-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }
        
        .need-help-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 20px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }
        
        .need-help-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        
        .need-help-tabs {
          display: flex;
          border-bottom: 1px solid #eee;
          margin-bottom: 16px;
        }
        
        .need-help-tab {
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 2px solid transparent;
        }
        
        .need-help-tab.active {
          border-bottom-color: \${primaryColor};
          color: \${primaryColor};
          font-weight: 500;
        }
        
        .need-help-tab-content {
          display: none;
        }
        
        .need-help-tab-content.active {
          display: block;
        }
        
        .need-help-article {
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .need-help-article:hover {
          background-color: #f9f9f9;
          border-color: #ddd;
        }
        
        .need-help-article-title {
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }
        
        .need-help-article-description {
          font-size: 12px;
          color: #666;
          margin: 0;
        }
        
        .need-help-faq {
          margin-bottom: 12px;
        }
        
        .need-help-faq-question {
          font-size: 14px;
          font-weight: 500;
          padding: 12px;
          background-color: #f5f5f5;
          border-radius: 8px;
          cursor: pointer;
          margin: 0;
        }
        
        .need-help-faq-answer {
          font-size: 14px;
          padding: 12px;
          border: 1px solid #eee;
          border-top: none;
          border-radius: 0 0 8px 8px;
          margin-top: -8px;
          display: none;
        }
        
        .need-help-faq.open .need-help-faq-answer {
          display: block;
        }
        
        .need-help-form {
          display: flex;
          flex-direction: column;
        }
        
        .need-help-form-group {
          margin-bottom: 12px;
        }
        
        .need-help-label {
          display: block;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .need-help-input,
        .need-help-textarea,
        .need-help-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .need-help-textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .need-help-button-submit {
          padding: 10px 16px;
          background-color: \${primaryColor};
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          align-self: flex-end;
        }
        
        .need-help-chat {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .need-help-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        
        .need-help-message {
          margin-bottom: 12px;
          max-width: 80%;
        }
        
        .need-help-message.user {
          align-self: flex-end;
          background-color: \${primaryColor};
          color: white;
          border-radius: 16px 16px 0 16px;
          padding: 8px 12px;
        }
        
        .need-help-message.bot {
          align-self: flex-start;
          background-color: #f1f1f1;
          border-radius: 16px 16px 16px 0;
          padding: 8px 12px;
        }
        
        .need-help-chat-input {
          display: flex;
          padding: 12px;
          border-top: 1px solid #eee;
        }
        
        .need-help-chat-textarea {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          resize: none;
        }
        
        .need-help-chat-send {
          background-color: \${primaryColor};
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          margin-left: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .need-help-footer {
          padding: 12px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        
        @media (max-width: 480px) {
          .need-help-panel {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 0;
          }
          
          .need-help-widget.bottom-right .need-help-panel,
          .need-help-widget.bottom-left .need-help-panel,
          .need-help-widget.top-right .need-help-panel,
          .need-help-widget.top-left .need-help-panel {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
        }
        
        .need-help-dark-mode {
          /* Estilos para modo escuro */
        }
      \`;
      document.head.appendChild(styles);
      
      // Criar o HTML do widget
      const widgetContainer = document.createElement('div');
      widgetContainer.className = \`need-help-widget \${position} \${theme === 'dark' ? 'need-help-dark-mode' : ''}\`;
      
      // Criar o botão
      const button = document.createElement('button');
      button.className = 'need-help-button';
      button.innerHTML = \`
        <span class="need-help-icon">
          \${getIconSvg(buttonIcon)}
        </span>
        <span>\${buttonText}</span>
      \`;
      
      // Criar o painel
      const panel = document.createElement('div');
      panel.className = 'need-help-panel';
      if (initialState === 'open') {
        panel.classList.add('open');
      }
      
      // Criar o cabeçalho do painel
      const header = document.createElement('div');
      header.className = 'need-help-header';
      header.innerHTML = \`
        <h3 class="need-help-title">Como podemos ajudar?</h3>
        <button class="need-help-close">&times;</button>
      \`;
      
      // Criar o conteúdo do painel
      const content = document.createElement('div');
      content.className = 'need-help-content';
      
      // Criar as abas
      const tabs = document.createElement('div');
      tabs.className = 'need-help-tabs';
      tabs.innerHTML = \`
        <div class="need-help-tab active" data-tab="articles">Artigos</div>
        <div class="need-help-tab" data-tab="faq">FAQ</div>
        <div class="need-help-tab" data-tab="chat">Chat</div>
        <div class="need-help-tab" data-tab="contact">Contato</div>
      \`;
      
      // Criar o conteúdo das abas
      const tabContents = document.createElement('div');
      tabContents.innerHTML = \`
        <div class="need-help-tab-content active" data-tab-content="articles">
          <div class="need-help-article">
            <h4 class="need-help-article-title">Primeiros passos</h4>
            <p class="need-help-article-description">Aprenda como começar a usar nossa plataforma.</p>
          </div>
          <div class="need-help-article">
            <h4 class="need-help-article-title">Como personalizar seu chatbot</h4>
            <p class="need-help-article-description">Guia completo de personalização.</p>
          </div>
          <div class="need-help-article">
            <h4 class="need-help-article-title">Integrando com seu site</h4>
            <p class="need-help-article-description">Métodos de integração disponíveis.</p>
          </div>
        </div>
        
        <div class="need-help-tab-content" data-tab-content="faq">
          <div class="need-help-faq">
            <h4 class="need-help-faq-question">Como posso criar um novo chatbot?</h4>
            <div class="need-help-faq-answer">
              Para criar um novo chatbot, acesse o painel de controle e clique no botão "Novo Chatbot". Siga as instruções para configurar seu chatbot.
            </div>
          </div>
          <div class="need-help-faq">
            <h4 class="need-help-faq-question">Quais são os planos disponíveis?</h4>
            <div class="need-help-faq-answer">
              Oferecemos planos Gratuito, Básico, Profissional e Empresarial. Cada plano tem diferentes limites e recursos.
            </div>
          </div>
          <div class="need-help-faq">
            <h4 class="need-help-faq-question">Como personalizar as respostas do chatbot?</h4>
            <div class="need-help-faq-answer">
              Você pode personalizar as respostas do chatbot através do sistema de prompts e base de conhecimento. Acesse as configurações do seu chatbot para mais detalhes.
            </div>
          </div>
        </div>
        
        <div class="need-help-tab-content" data-tab-content="chat">
          <div class="need-help-chat">
            <div class="need-help-chat-messages">
              <div class="need-help-message bot">
                Olá! Como posso ajudar você hoje?
              </div>
            </div>
            <div class="need-help-chat-input">
              <textarea class="need-help-chat-textarea" placeholder="Digite sua mensagem..."></textarea>
              <button class="need-help-chat-send">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="need-help-tab-content" data-tab-content="contact">
          <form class="need-help-form">
            <div class="need-help-form-group">
              <label class="need-help-label" for="need-help-name">Nome</label>
              <input class="need-help-input" type="text" id="need-help-name" required>
            </div>
            <div class="need-help-form-group">
              <label class="need-help-label" for="need-help-email">Email</label>
              <input class="need-help-input" type="email" id="need-help-email" required>
            </div>
            <div class="need-help-form-group">
              <label class="need-help-label" for="need-help-subject">Assunto</label>
              <input class="need-help-input" type="text" id="need-help-subject" required>
            </div>
            <div class="need-help-form-group">
              <label class="need-help-label" for="need-help-message">Mensagem</label>
              <textarea class="need-help-textarea" id="need-help-message" required></textarea>
            </div>
            <button type="submit" class="need-help-button-submit">Enviar</button>
          </form>
        </div>
      \`;
      
      // Criar o rodapé
      const footer = document.createElement('div');
      footer.className = 'need-help-footer';
      footer.textContent = 'Powered by ChatbotAI';
      
      // Montar o painel
      content.appendChild(tabs);
      content.appendChild(tabContents);
      panel.appendChild(header);
      panel.appendChild(content);
      panel.appendChild(footer);
      
      // Montar o widget
      widgetContainer.appendChild(button);
      widgetContainer.appendChild(panel);
      document.body.appendChild(widgetContainer);
      
      // Adicionar eventos
      button.addEventListener('click', function() {
        panel.classList.toggle('open');
      });
      
      const closeButton = panel.querySelector('.need-help-close');
      closeButton.addEventListener('click', function() {
        panel.classList.remove('open');
      });
      
      // Eventos das abas
      const tabButtons = tabs.querySelectorAll('.need-help-tab');
      tabButtons.forEach(function(tabButton) {
        tabButton.addEventListener('click', function() {
          const tabName = this.getAttribute('data-tab');
          
          // Atualizar abas ativas
          tabButtons.forEach(function(btn) {
            btn.classList.remove('active');
          });
          this.classList.add('active');
          
          // Atualizar conteúdo ativo
          const tabContentElements = tabContents.querySelectorAll('.need-help-tab-content');
          tabContentElements.forEach(function(content) {
            content.classList.remove('active');
          });
          tabContents.querySelector(\`[data-tab-content="\${tabName}"]\`).classList.add('active');
        });
      });
      
      // Eventos do FAQ
      const faqQuestions = tabContents.querySelectorAll('.need-help-faq-question');
      faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
          const faq = this.parentElement;
          faq.classList.toggle('open');
        });
      });
      
      // Eventos do chat
      const chatTextarea = panel.querySelector('.need-help-chat-textarea');
      const chatSendButton = panel.querySelector('.need-help-chat-send');
      const chatMessages = panel.querySelector('.need-help-chat-messages');
      
      function sendChatMessage() {
        const message = chatTextarea.value.trim();
        if (message) {
          // Adicionar mensagem do usuário
          const userMessageElement = document.createElement('div');
          userMessageElement.className = 'need-help-message user';
          userMessageElement.textContent = message;
          chatMessages.appendChild(userMessageElement);
          
          // Limpar textarea
          chatTextarea.value = '';
          
          // Rolar para o final
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Enviar para a API e obter resposta
          fetch(\`\${apiUrl}/api/v1/chatbots/\${chatbotId}/chat\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message,
              sessionId: getSessionId(),
            }),
          })
          .then(response => response.json())
          .then(data => {
            // Adicionar resposta do bot
            const botMessageElement = document.createElement('div');
            botMessageElement.className = 'need-help-message bot';
            botMessageElement.textContent = data.message || data.content || 'Desculpe, não consegui processar sua mensagem.';
            chatMessages.appendChild(botMessageElement);
            
            // Rolar para o final
            chatMessages.scrollTop = chatMessages.scrollHeight;
          })
          .catch(error => {
            console.error('Erro ao enviar mensagem:', error);
            
            // Adicionar mensagem de erro
            const errorMessageElement = document.createElement('div');
            errorMessageElement.className = 'need-help-message bot';
            errorMessageElement.textContent = 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
            chatMessages.appendChild(errorMessageElement);
            
            // Rolar para o final
            chatMessages.scrollTop = chatMessages.scrollHeight;
          });
        }
      }
      
      chatSendButton.addEventListener('click', sendChatMessage);
      
      chatTextarea.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendChatMessage();
        }
      });
      
      // Eventos do formulário de contato
      const contactForm = panel.querySelector('.need-help-form');
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('#need-help-name').value;
        const email = this.querySelector('#need-help-email').value;
        const subject = this.querySelector('#need-help-subject').value;
        const message = this.querySelector('#need-help-message').value;
        
        // Enviar para a API
        fetch(\`\${apiUrl}/api/v1/chatbots/\${chatbotId}/contact\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
          }),
        })
        .then(response => response.json())
        .then(data => {
          // Limpar formulário
          this.reset();
          
          // Mostrar mensagem de sucesso
          const successMessage = document.createElement('div');
          successMessage.style.padding = '12px';
          successMessage.style.backgroundColor = '#d4edda';
          successMessage.style.color = '#155724';
          successMessage.style.borderRadius = '4px';
          successMessage.style.marginTop = '16px';
          successMessage.textContent = 'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.';
          
          this.appendChild(successMessage);
          
          // Remover mensagem após 5 segundos
          setTimeout(function() {
            successMessage.remove();
          }, 5000);
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
          
          // Mostrar mensagem de erro
          const errorMessage = document.createElement('div');
          errorMessage.style.padding = '12px';
          errorMessage.style.backgroundColor = '#f8d7da';
          errorMessage.style.color = '#721c24';
          errorMessage.style.borderRadius = '4px';
          errorMessage.style.marginTop = '16px';
          errorMessage.textContent = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.';
          
          this.appendChild(errorMessage);
          
          // Remover mensagem após 5 segundos
          setTimeout(function() {
            errorMessage.remove();
          }, 5000);
        });
      });
      
      // Auto-abrir após delay
      if (autoOpenDelay !== 'disabled') {
        const delay = parseInt(autoOpenDelay, 10);
        if (!isNaN(delay) && delay > 0) {
          setTimeout(function() {
            if (!panel.classList.contains('open')) {
              panel.classList.add('open');
            }
          }, delay);
        }
      }
      
      // API pública
      window.ChatbotAI = window.ChatbotAI || {};
      window.ChatbotAI.needHelp = {
        open: function() {
          panel.classList.add('open');
        },
        close: function() {
          panel.classList.remove('open');
        },
        toggle: function() {
          panel.classList.toggle('open');
        },
        configure: function(config) {
          // Implementar configuração dinâmica
          console.log('Configure:', config);
        },
        setContext: function(context, data) {
          // Implementar configuração de contexto
          console.log('Set context:', context, data);
        },
        setUser: function(user) {
          // Implementar configuração de usuário
          console.log('Set user:', user);
        },
        on: function(event, callback) {
          // Implementar sistema de eventos
          console.log('Register event:', event);
        },
        customizeContactForm: function(config) {
          // Implementar personalização do formulário
          console.log('Customize form:', config);
        }
      };
      
      // Disparar evento de carregamento
      const readyEvent = new Event('chatbotAIReady');
      window.dispatchEvent(readyEvent);
      
      // Funções auxiliares
      function getSessionId() {
        let sessionId = localStorage.getItem('chatbotAI_sessionId');
        if (!sessionId) {
          sessionId = generateUUID();
          localStorage.setItem('chatbotAI_sessionId', sessionId);
        }
        return sessionId;
      }
      
      function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      
      function getIconSvg(icon) {
        const icons = {
          question: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
          chat: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
          support: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>',
          info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };
        
        return icons[icon] || icons.question;
      }
    })();
  `
}
