"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { LogIn, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { LanguageSwitcher } from "./language-switcher"

export function SiteHeader() {
  const pathname = usePathname()
  const { user, signIn } = useAuth()
  const [open, setOpen] = useState(false)
  const t = useTranslations("navigation")

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/" || pathname.endsWith("/"),
    },
    {
      href: "/catalog",
      label: t("catalog"),
      active: pathname.includes("/catalog"),
    },
    {
      href: "/pricing",
      label: t("pricing"),
      active: pathname.includes("/pricing"),
    },
    {
      href: "/about",
      label: t("about"),
      active: pathname.includes("/about"),
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">ChatBot AI</span>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                <span className="font-bold">ChatBot AI</span>
              </Link>
              <div className="my-4 flex flex-col space-y-3">
                {routes.map((route) => (
                  <Button
                    key={route.href}
                    variant={route.active ? "secondary" : "ghost"}
                    className="justify-start"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href={route.href}>{route.label}</Link>
                  </Button>
                ))}
              </div>
              {user ? (
                <Button className="mt-4 w-full" asChild onClick={() => setOpen(false)}>
                  <Link href="/dashboard">{t("dashboard")}</Link>
                </Button>
              ) : (
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    signIn()
                    setOpen(false)
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("login")}
                </Button>
              )}
            </SheetContent>
          </Sheet>

          <nav className="hidden gap-6 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {routes.map((route) => (
                  <NavigationMenuItem key={route.href}>
                    <Link href={route.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(navigationMenuTriggerStyle(), route.active && "bg-accent text-accent-foreground")}
                      >
                        {route.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <Button asChild>
              <Link href="/dashboard">{t("dashboard")}</Link>
            </Button>
          ) : (
            <Button onClick={signIn} className="hidden md:flex">
              <LogIn className="mr-2 h-4 w-4" />
              {t("login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
