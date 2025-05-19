import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/db"

// Verify required environment variables
const requiredEnvVars = ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`)
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      try {
        console.log("Session callback - token:", token)
        console.log("Session callback - user:", user)

        // When using JWT strategy, user comes from token
        if (token && session.user) {
          session.user.id = token.sub || token.id
        }

        // When using database strategy, user object is provided directly
        if (user && session.user) {
          session.user.id = user.id

          // Get user from database to get role
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
          })

          if (dbUser) {
            session.user.role = dbUser.role
          }
        }

        console.log("Final session:", session)
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        // Return the session without additional data if there's an error
        return session
      }
    },
    async jwt({ token, user }) {
      // Add user.id to token right after sign in
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt", // Use JWT strategy for better compatibility
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
