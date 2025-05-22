import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot } from "lucide-react"
import { DomainWelcome } from "@/components/domain-welcome"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <span className="text-xl font-bold">ChatbotAI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/catalog" className="text-sm font-medium hover:underline">
              Catalog
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <DomainWelcome />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Intelligent Chatbots for Your Business
            </h1>
            <p className="mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Create customizable AI chatbots that understand your business and answer customer questions intelligently.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Create Your Chatbot <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button size="lg" variant="outline">
                  Explore Catalog
                </Button>
              </Link>
            </div>
          </div>
        </section>
        {/* Resto do conteúdo permanece o mesmo */}
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">ChatbotAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2023 ChatbotAI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
