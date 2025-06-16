"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export function useBreadcrumb() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)
    const items: BreadcrumbItem[] = []

    // Always start with Dashboard
    items.push({
      label: "Dashboard",
      href: "/dashboard",
    })

    // Build breadcrumbs based on path segments
    let currentPath = ""
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]
      currentPath += `/${segment}`

      // Skip dynamic segments like [id]
      if (segment.startsWith("[") && segment.endsWith("]")) {
        continue
      }

      let label = segment

      // Custom labels for specific routes
      switch (segment) {
        case "chatbots":
          label = "Chatbots"
          break
        case "new":
          label = "Novo Chatbot"
          break
        case "edit":
          label = "Editar"
          break
        case "insights":
          label = "Insights"
          break
        case "playground":
          label = "Playground"
          break
        case "embed":
          label = "Incorporar"
          break
        case "admin":
          label = "Administração"
          break
        case "global-settings":
          label = "Configurações Globais"
          break
        case "need-help":
          label = "Precisa de Ajuda"
          break
        case "database":
          label = "Banco de Dados"
          break
        case "subscription":
          label = "Assinatura"
          break
        case "documentation":
          label = "Documentação"
          break
        default:
          // Capitalize first letter
          label = segment.charAt(0).toUpperCase() + segment.slice(1)
      }

      items.push({
        label,
        href: `/dashboard${currentPath}`,
      })
    }

    return items
  }, [pathname])

  return breadcrumbs
}
