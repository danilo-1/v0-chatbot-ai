"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const searchParams = useSearchParams()

  // Limpar URL se tiver callbackUrl recursivo
  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl")
    if (callbackUrl && callbackUrl.includes("/login")) {
      // Se o callbackUrl contém login, é um redirecionamento recursivo
      // Limpar a URL usando history API
      window.history.replaceState({}, document.title, "/login")
    }
  }, [searchParams])

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    // Obter callbackUrl limpo (sem recursão)
    const callbackUrl = searchParams.get("callbackUrl")
    const cleanCallbackUrl = callbackUrl && !callbackUrl.includes("/login") ? callbackUrl : undefined

    await signIn(cleanCallbackUrl)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to ChatbotAI</CardTitle>
          <CardDescription>Sign in to create and manage your AI chatbots</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
            )}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
