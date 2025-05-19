import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/db"

// Verify required environment variables
const requiredEnvVars = ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
}

// Create a more resilient adapter
const createAdapter = () => {
  try {
    return PrismaAdapter(prisma)
  } catch (error) {
    console.error("Error creating Prisma adapter:", error)
    // Return a minimal adapter that logs errors
    return {
      createUser: async (data) => {
        console.error("Adapter error - createUser called but adapter failed to initialize")
        throw new Error("Database adapter not initialized properly")
      },
      getUser: async (id) => {
        console.error("Adapter error - getUser called but adapter failed to initialize")
        return null
      },
      getUserByEmail: async (email) => {
        console.error("Adapter error - getUserByEmail called but adapter failed to initialize")
        return null
      },
      // Add other required methods with similar error handling
    }
  }
}

export const authOptions = {
  adapter: createAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      try {
        // When using JWT strategy, user comes from token
        if (token && session.user) {
          session.user.id = token.sub || token.id
        }

        // When using database strategy, user object is provided directly
        if (user && session.user) {
          session.user.id = user.id

          // Get user from database to get role
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
            })

            if (dbUser) {
              session.user.role = dbUser.role
            }
          } catch (error) {
            console.error("Error fetching user role:", error)
            // Continue without role information
          }
        }

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
