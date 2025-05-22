import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ChatBot AI. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms">
            <Button variant="link" size="sm" className="text-muted-foreground">
              Termos
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="link" size="sm" className="text-muted-foreground">
              Privacidade
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="link" size="sm" className="text-muted-foreground">
              Contato
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  )
}
