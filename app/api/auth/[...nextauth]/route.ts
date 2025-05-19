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

// Create a more resilient adapter with connection retries
const createAdapter = () => {
  // Create a wrapper around the Prisma adapter with retry logic
  const adapter = PrismaAdapter(prisma)

  // Wrap each method with retry logic
  const wrappedAdapter = {
    ...adapter,
    // Example of wrapping a method with retry logic
    getUserByAccount: async (params) => {
      const maxRetries = 3
      let lastError

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await adapter.getUserByAccount(params)
        } catch (error) {
          console.error(`Attempt ${attempt}/${maxRetries} failed:`, error)
          lastError = error

          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries) {
            const delay = Math.min(100 * Math.pow(2, attempt), 3000)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      // If all retries failed, throw the last error
      throw lastError
    },
    createUser: async (data) => {
      const maxRetries = 3
      let lastError

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await adapter.createUser(data)
        } catch (error) {
          console.error(`Attempt ${attempt}/${maxRetries} failed:`, error)
          lastError = error

          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries) {
            const delay = Math.min(100 * Math.pow(2, attempt), 3000)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      // If all retries failed, throw the last error
      throw lastError
    },
    getUser: async (id) => {
      const maxRetries = 3
      let lastError

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await adapter.getUser(id)
        } catch (error) {
          console.error(`Attempt ${attempt}/${maxRetries} failed:`, error)
          lastError = error

          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries) {
            const delay = Math.min(100 * Math.pow(2, attempt), 3000)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      // If all retries failed, throw the last error
      throw lastError
    },
    getUserByEmail: async (email) => {
      const maxRetries = 3
      let lastError

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await adapter.getUserByEmail(email)
        } catch (error) {
          console.error(`Attempt ${attempt}/${maxRetries} failed:`, error)
          lastError = error

          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries) {
            const delay = Math.min(100 * Math.pow(2, attempt), 3000)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      // If all retries failed, throw the last error
      throw lastError
    },
    // Add other required methods with similar error handling
  }

  return wrappedAdapter
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
