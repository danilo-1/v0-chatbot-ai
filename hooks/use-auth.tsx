"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isAdmin = session?.user?.email === "danilo.nsantana.dns@gmail.com"

  return {
    user: session?.user,
    isAdmin,
    loading: status === "loading",
    signIn: () => signIn("google", { callbackUrl: "/dashboard" }),
    signOut: () => signOut({ callbackUrl: "/" }),
  }
}
