import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Briefcase, ReplaceIcon as Customize, MessageSquare } from "lucide-react"

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
        <section className="bg-muted py-20">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Perfect for Businesses</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <Briefcase className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Business FAQs</h3>
                <p className="text-muted-foreground">
                  Automatically answer common customer questions about your products and services.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <Customize className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Fully Customizable</h3>
                <p className="text-muted-foreground">
                  Tailor your chatbot's knowledge, appearance, and behavior to match your brand.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <MessageSquare className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Intelligent Responses</h3>
                <p className="text-muted-foreground">
                  Powered by advanced AI to provide helpful, context-aware answers.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                <p className="text-muted-foreground">Sign up with your Google account in seconds.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Add Your Knowledge</h3>
                <p className="text-muted-foreground">Input your business information, FAQs, and product details.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Deploy Your Chatbot</h3>
                <p className="text-muted-foreground">Test, customize, and integrate the chatbot on your website.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-20">
          <div className="container">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter mb-6">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-muted-foreground mb-8">
                Join hundreds of businesses already using our AI chatbots to improve customer service and boost sales.
              </p>
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Create Your Chatbot <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
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
