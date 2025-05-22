"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bot, Home, Plus, Settings, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface DashboardNavProps {
  setOpen?: (open: boolean) => void
}

export function DashboardNav({ setOpen }: DashboardNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const isAdmin = user?.email === "danilo.nsantana.dns@gmail.com"

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/chatbots",
      label: "Meus Chatbots",
      icon: Bot,
      active: pathname === "/dashboard/chatbots",
    },
    {
      href: "/dashboard/create",
      label: "Criar Chatbot",
      icon: Plus,
      active: pathname === "/dashboard/create",
    },
    {
      href: "/dashboard/settings",
      label: "Configurações",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ]

  // Adiciona a rota de administração global apenas para o admin
  if (isAdmin) {
    routes.push({
      href: "/dashboard/admin",
      label: "Admin Global",
      icon: Users,
      active: pathname === "/dashboard/admin",
    })
  }

  return (
    <nav className="hidden w-full flex-col md:flex">
      <div className="flex flex-col gap-2 py-2">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "secondary" : "ghost"}
            className={cn("justify-start", route.active && "bg-muted font-medium")}
            asChild
            onClick={() => setOpen && setOpen(false)}
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
