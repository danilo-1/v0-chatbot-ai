import { BarChart, FileText, Home, Settings, ShoppingBag, User, Users } from "lucide-react"

import type { MainNavItem, SidebarNavItem } from "@/types"

interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: ShoppingBag,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: BarChart,
    },
    {
      title: "Invoices",
      href: "/dashboard/invoices",
      icon: FileText,
      description: "Documentação da API",
    },
    {
      title: "API Docs",
      href: "/docs",
      icon: FileText,
      description: "Documentação da API",
    },
    {
      title: "Account",
      href: "/dashboard/account",
      icon: User,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],
}
