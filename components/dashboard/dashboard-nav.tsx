"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, LayoutDashboard, Settings, User, HelpCircle, CreditCard } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType
  admin?: boolean
}

export function DashboardNav() {
  const pathname = usePathname()

  const items: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Overview",
      href: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Subscription",
      href: "/dashboard/subscription",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Need Help",
      href: "/dashboard/admin/need-help",
      icon: HelpCircle,
      admin: true,
    },
  ]

  return (
    <nav className="space-y-1">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.title}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
              asChild
            >
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Adicionar exportação padrão para compatibilidade
export default DashboardNav
