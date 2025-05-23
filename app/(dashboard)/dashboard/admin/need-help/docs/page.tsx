"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyButton } from "@/components/ui/copy-button"

export default function NeedHelpDocs() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/need-help">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Documentação do Módulo "Need Help"</h1>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="installation">Instalação</TabsTrigger>
          <TabsTrigger value="customization">Personalização</TabsTrigger>
          <TabsTrigger value="api">API JavaScript</TabsTrigger>
          <TabsTrigger value="examples">Exemplos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>O que é o módulo "Need Help"?</CardTitle>
              <CardDescription>Uma visão geral do módulo e seus recursos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O módulo "Need Help" é uma solução abrangente de suporte ao cliente que vai além do chatbot tradicional,
                integrando múltiplos canais de ajuda em uma interface unificada e contextual.
              </p>

              <h3 className="text-lg font-medium mt-4">Principais recursos:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Múltiplos canais de suporte:</strong> Artigos de ajuda, FAQs, chat com IA e formulário de
                  contato em uma única interface.
                </li>
                <li>
                  <strong>Ajuda contextual:</strong> Sugere artigos e FAQs relevantes com base na página atual do
                  usuário.
                </li>
                <li>
                  <strong>Personalização completa:</strong> Adapte a aparência e o comportamento do widget para se
                  adequar ao seu site.
                </li>
                <li>
                  <strong>Análise de uso:</strong> Acompanhe estatísticas de interações, artigos populares e taxa de
                  resolução.
                </li>
                <li>
                  <strong>Fácil integração:</strong> Adicione o widget ao seu site com uma única linha de código.
                </li>
              </ul>

              <h3 className="text-lg font-medium mt-4">Benefícios:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Redução significativa no volume de tickets de suporte</li>
                <li>Melhoria na experiência do usuário com respostas imediatas</li>
                <li>Economia de tempo e recursos da equipe de suporte</li>
                <li>Insights valiosos sobre as dúvidas mais comuns dos usuários</li>
                <li>Suporte 24/7 sem necessidade de equipe disponível em tempo integral</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Instalação</CardTitle>
              <CardDescription>Como adicionar o módulo "Need Help" ao seu site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Instalação Básica</h3>
              <p>
                Adicione o script a seguir ao seu site, preferencialmente antes da tag de fechamento{" "}
                <code>{"</body>"}</code>:
              </p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`<script 
  src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" 
  async></script>`}</code>
                </pre>
                <CopyButton
                  value={`<script 
  src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" 
  async></script>`}
                  className="absolute top-2 right-2"
                />
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Substitua <code>YOUR_CHATBOT_ID</code> pelo ID do seu chatbot.
              </p>

              <h3 className="text-lg font-medium mt-6">Instalação com Configurações</h3>
              <p>
                Você pode personalizar o comportamento do widget adicionando atributos <code>data-*</code> ao script:
              </p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`<script 
  src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" 
  data-position="bottom-left"
  data-theme="dark"
  data-button-text="Precisa de ajuda?"
  data-primary-color="#7c3aed"
  async></script>`}</code>
                </pre>
                <CopyButton
                  value={`<script 
  src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" 
  data-position="bottom-left"
  data-theme="dark"
  data-button-text="Precisa de ajuda?"
  data-primary-color="#7c3aed"
  async></script>`}
                  className="absolute top-2 right-2"
                />
              </div>

              <h3 className="text-lg font-medium mt-6">Instalação em Aplicações SPA</h3>
              <p>
                Para aplicações de página única (SPA) como React, Vue ou Angular, você pode adicionar o script
                dinamicamente:
              </p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// React/Next.js exemplo (em um componente)
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID';
  script.async = true;
  script.dataset.theme = 'auto';
  document.body.appendChild(script);
  
  return () => {
    document.body.removeChild(script);
  };
}, []);`}</code>
                </pre>
                <CopyButton
                  value={`// React/Next.js exemplo (em um componente)
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID';
  script.async = true;
  script.dataset.theme = 'auto';
  document.body.appendChild(script);
  
  return () => {
    document.body.removeChild(script);
  };
}, []);`}
                  className="absolute top-2 right-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalização</CardTitle>
              <CardDescription>Opções de personalização do módulo "Need Help"</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">Atributos de Configuração</h3>
              <p className="mb-4">
                Você pode personalizar o widget usando os seguintes atributos <code>data-*</code>:
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atributo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valores Possíveis</TableHead>
                    <TableHead>Padrão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <code>data-mode</code>
                    </TableCell>
                    <TableCell>Modo de exibição inicial</TableCell>
                    <TableCell>
                      <code>help</code>, <code>chat</code>, <code>combined</code>
                    </TableCell>
                    <TableCell>
                      <code>help</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-position</code>
                    </TableCell>
                    <TableCell>Posição do widget na tela</TableCell>
                    <TableCell>
                      <code>bottom-right</code>, <code>bottom-left</code>, <code>top-right</code>, <code>top-left</code>
                    </TableCell>
                    <TableCell>
                      <code>bottom-right</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-theme</code>
                    </TableCell>
                    <TableCell>Tema de cores</TableCell>
                    <TableCell>
                      <code>light</code>, <code>dark</code>, <code>auto</code>
                    </TableCell>
                    <TableCell>
                      <code>light</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-button-text</code>
                    </TableCell>
                    <TableCell>Texto do botão</TableCell>
                    <TableCell>Qualquer texto</TableCell>
                    <TableCell>
                      <code>Need Help?</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-button-icon</code>
                    </TableCell>
                    <TableCell>Ícone do botão</TableCell>
                    <TableCell>
                      <code>question</code>, <code>chat</code>, <code>support</code>, <code>info</code>
                    </TableCell>
                    <TableCell>
                      <code>question</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-primary-color</code>
                    </TableCell>
                    <TableCell>Cor primária</TableCell>
                    <TableCell>Qualquer valor de cor CSS válido</TableCell>
                    <TableCell>
                      <code>#7c3aed</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-auto-open-delay</code>
                    </TableCell>
                    <TableCell>Atraso para abrir automaticamente (ms)</TableCell>
                    <TableCell>Número em milissegundos ou "disabled"</TableCell>
                    <TableCell>
                      <code>disabled</code>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="text-lg font-medium mt-6">Canais de Suporte</h3>
              <p className="mb-4">Você pode habilitar ou desabilitar canais de suporte específicos:</p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atributo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valores</TableHead>
                    <TableHead>Padrão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <code>data-enable-articles</code>
                    </TableCell>
                    <TableCell>Habilita artigos de ajuda</TableCell>
                    <TableCell>
                      <code>true</code>, <code>false</code>
                    </TableCell>
                    <TableCell>
                      <code>true</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-enable-faq</code>
                    </TableCell>
                    <TableCell>Habilita perguntas frequentes</TableCell>
                    <TableCell>
                      <code>true</code>, <code>false</code>
                    </TableCell>
                    <TableCell>
                      <code>true</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-enable-chat</code>
                    </TableCell>
                    <TableCell>Habilita chat com IA</TableCell>
                    <TableCell>
                      <code>true</code>, <code>false</code>
                    </TableCell>
                    <TableCell>
                      <code>true</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>data-enable-contact</code>
                    </TableCell>
                    <TableCell>Habilita formulário de contato</TableCell>
                    <TableCell>
                      <code>true</code>, <code>false</code>
                    </TableCell>
                    <TableCell>
                      <code>true</code>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API JavaScript</CardTitle>
              <CardDescription>Controle programático do widget "Need Help"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O módulo "Need Help" expõe uma API JavaScript global que permite controlar o widget programaticamente:
              </p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Objeto global
window.NeedHelp`}</code>
                </pre>
              </div>

              <h3 className="text-lg font-medium mt-4">Métodos Disponíveis</h3>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Método</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Exemplo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <code>open()</code>
                    </TableCell>
                    <TableCell>Abre o widget</TableCell>
                    <TableCell>
                      <code>window.NeedHelp.open()</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>close()</code>
                    </TableCell>
                    <TableCell>Fecha o widget</TableCell>
                    <TableCell>
                      <code>window.NeedHelp.close()</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>toggle()</code>
                    </TableCell>
                    <TableCell>Alterna entre aberto e fechado</TableCell>
                    <TableCell>
                      <code>window.NeedHelp.toggle()</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>setMode(mode)</code>
                    </TableCell>
                    <TableCell>Define o modo de exibição</TableCell>
                    <TableCell>
                      <code>window.NeedHelp.setMode('chat')</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>setContext(context)</code>
                    </TableCell>
                    <TableCell>Define o contexto atual</TableCell>
                    <TableCell>
                      <code>{`window.NeedHelp.setContext({
  page: 'pricing',
  user: { id: '123', name: 'John' }
})`}</code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>setTheme(theme)</code>
                    </TableCell>
                    <TableCell>Define o tema</TableCell>
                    <TableCell>
                      <code>window.NeedHelp.setTheme('dark')</code>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="text-lg font-medium mt-6">Eventos</h3>
              <p>Você pode escutar eventos do widget:</p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Escutar evento de abertura
window.NeedHelp.on('open', function() {
  console.log('Widget aberto');
});

// Escutar evento de fechamento
window.NeedHelp.on('close', function() {
  console.log('Widget fechado');
});

// Escutar evento de envio de formulário de contato
window.NeedHelp.on('contactSubmit', function(data) {
  console.log('Formulário enviado:', data);
});

// Escutar evento de visualização de artigo
window.NeedHelp.on('articleView', function(articleId) {
  console.log('Artigo visualizado:', articleId);
});`}</code>
                </pre>
                <CopyButton
                  value={`// Escutar evento de abertura
window.NeedHelp.on('open', function() {
  console.log('Widget aberto');
});

// Escutar evento de fechamento
window.NeedHelp.on('close', function() {
  console.log('Widget fechado');
});

// Escutar evento de envio de formulário de contato
window.NeedHelp.on('contactSubmit', function(data) {
  console.log('Formulário enviado:', data);
});

// Escutar evento de visualização de artigo
window.NeedHelp.on('articleView', function(articleId) {
  console.log('Artigo visualizado:', articleId);
});`}
                  className="absolute top-2 right-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exemplos de Uso</CardTitle>
              <CardDescription>Exemplos práticos de implementação do módulo "Need Help"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Exemplo 1: Instalação Básica</h3>
                <p>Adicione o widget com configurações padrão:</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`<script src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" async></script>`}</code>
                  </pre>
                  <CopyButton
                    value={`<script src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" async></script>`}
                    className="absolute top-2 right-2"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Exemplo 2: Personalização Completa</h3>
                <p>Personalize a aparência e o comportamento do widget:</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`<script 
  src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" 
  data-position="bottom-left"
  data-theme="dark"
  data-button-text="Precisa de ajuda?"
  data-button-icon="support"
  data-primary-color="#3b82f6"
  data-mode="combined"
  data-auto-open-delay="5000"
  async></script>`}</code>
                  </pre>
                  <CopyButton
                    value={`<script 
  src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" 
  data-position="bottom-left"
  data-theme="dark"
  data-button-text="Precisa de ajuda?"
  data-button-icon="support"
  data-primary-color="#3b82f6"
  data-mode="combined"
  data-auto-open-delay="5000"
  async></script>`}
                    className="absolute top-2 right-2"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Exemplo 3: Configuração via JavaScript</h3>
                <p>Configure o widget programaticamente após o carregamento:</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`<script src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" async></script>
<script>
  // Aguarde o carregamento do widget
  window.addEventListener('NeedHelpLoaded', function() {
    // Configure o widget
    window.NeedHelp.setTheme('dark');
    window.NeedHelp.setMode('chat');
    
    // Defina o contexto atual
    window.NeedHelp.setContext({
      page: 'pricing',
      user: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }
    });
    
    // Abra o widget automaticamente após 3 segundos
    setTimeout(function() {
      window.NeedHelp.open();
    }, 3000);
  });
</script>`}</code>
                  </pre>
                  <CopyButton
                    value={`<script src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" async></script>
<script>
  // Aguarde o carregamento do widget
  window.addEventListener('NeedHelpLoaded', function() {
    // Configure o widget
    window.NeedHelp.setTheme('dark');
    window.NeedHelp.setMode('chat');
    
    // Defina o contexto atual
    window.NeedHelp.setContext({
      page: 'pricing',
      user: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }
    });
    
    // Abra o widget automaticamente após 3 segundos
    setTimeout(function() {
      window.NeedHelp.open();
    }, 3000);
  });
</script>`}
                    className="absolute top-2 right-2"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Exemplo 4: Integração com Sistema de Tickets</h3>
                <p>Integre o formulário de contato com um sistema de tickets externo:</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`<script src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" async></script>
<script>
  window.addEventListener('NeedHelpLoaded', function() {
    // Escute o evento de envio de formulário de contato
    window.NeedHelp.on('contactSubmit', function(data) {
      // Envie os dados para seu sistema de tickets
      fetch('https://seu-sistema-de-tickets.com/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: data.subject,
          description: data.message,
          requester: {
            name: data.name,
            email: data.email
          },
          priority: 'normal',
          source: 'need-help-widget'
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log('Ticket criado:', result);
      })
      .catch(error => {
        console.error('Erro ao criar ticket:', error);
      });
    });
  });
</script>`}</code>
                  </pre>
                  <CopyButton
                    value={`<script src="https://v0-chatbot-ai-kf.vercel.app/api/need-help/YOUR_CHATBOT_ID" async></script>
<script>
  window.addEventListener('NeedHelpLoaded', function() {
    // Escute o evento de envio de formulário de contato
    window.NeedHelp.on('contactSubmit', function(data) {
      // Envie os dados para seu sistema de tickets
      fetch('https://seu-sistema-de-tickets.com/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: data.subject,
          description: data.message,
          requester: {
            name: data.name,
            email: data.email
          },
          priority: 'normal',
          source: 'need-help-widget'
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log('Ticket criado:', result);
      })
      .catch(error => {
        console.error('Erro ao criar ticket:', error);
      });
    });
  });
</script>`}
                    className="absolute top-2 right-2"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Exemplo 5: Uso em SPA (React)</h3>
                <p>Integre o widget em uma aplicação React:</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`// components/NeedHelpWidget.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router'; // ou 'react-router-dom' para React

export default function NeedHelpWidget({ chatbotId, theme = 'light' }) {
  const router = useRouter();

  useEffect(() => {
    // Carregar o script
    const script = document.createElement('script');
    script.src = \`https://v0-chatbot-ai-kf.vercel.app/api/need-help/\${chatbotId}\`;
    script.async = true;
    script.dataset.theme = theme;
    document.body.appendChild(script);

    // Configurar o contexto quando a rota mudar
    const handleRouteChange = (url) => {
      if (window.NeedHelp) {
        window.NeedHelp.setContext({ page: url });
      }
    };

    // Escutar mudanças de rota
    router.events.on('routeChangeComplete', handleRouteChange);

    // Limpar ao desmontar
    return () => {
      document.body.removeChild(script);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [chatbotId, theme, router]);

  return null; // Este componente não renderiza nada visualmente
}

// Uso no _app.jsx ou layout.jsx
import NeedHelpWidget from '../components/NeedHelpWidget';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <NeedHelpWidget chatbotId="YOUR_CHATBOT_ID" theme="auto" />
    </>
  );
}`}</code>
                  </pre>
                  <CopyButton
                    value={`// components/NeedHelpWidget.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router'; // ou 'react-router-dom' para React

export default function NeedHelpWidget({ chatbotId, theme = 'light' }) {
  const router = useRouter();

  useEffect(() => {
    // Carregar o script
    const script = document.createElement('script');
    script.src = \`https://v0-chatbot-ai-kf.vercel.app/api/need-help/\${chatbotId}\`;
    script.async = true;
    script.dataset.theme = theme;
    document.body.appendChild(script);

    // Configurar o contexto quando a rota mudar
    const handleRouteChange = (url) => {
      if (window.NeedHelp) {
        window.NeedHelp.setContext({ page: url });
      }
    };

    // Escutar mudanças de rota
    router.events.on('routeChangeComplete', handleRouteChange);

    // Limpar ao desmontar
    return () => {
      document.body.removeChild(script);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [chatbotId, theme, router]);

  return null; // Este componente não renderiza nada visualmente
}

// Uso no _app.jsx ou layout.jsx
import NeedHelpWidget from '../components/NeedHelpWidget';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <NeedHelpWidget chatbotId="YOUR_CHATBOT_ID" theme="auto" />
    </>
  );
}`}
                    className="absolute top-2 right-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/need-help">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Configurações
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://github.com/v0-chatbot-ai/need-help-docs" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Documentação Completa
          </a>
        </Button>
      </div>
    </div>
  )
}
