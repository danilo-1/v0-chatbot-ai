"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, Home, Plus, Settings, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAdmin = session?.user?.email === "danilo.nsantana.dns@gmail.com"

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Chatbots",
      href: "/dashboard/chatbots",
      icon: Bot,
    },
    {
      title: "Create New",
      href: "/dashboard/chatbots/new",
      icon: Plus,
    },
    {
      title: "Telemetry",
      href: "/dashboard/telemetry",
      icon: BarChart,
    },
  ]

  if (isAdmin) {
    navItems.push({
      title: "Global Settings",
      href: "/dashboard/admin/global-settings",
      icon: Settings,
    })
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="py-2">
        <h2 className="px-2 text-lg font-semibold tracking-tight">Navigation</h2>
        <div className="space-y-1 py-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
