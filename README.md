# ChatbotAI Platform

A platform for creating customizable AI chatbots for websites.

## Features

- Create and manage AI chatbots
- Customize chatbot knowledge base and behavior
- Test chatbots in a playground environment
- Share chatbots publicly
- Admin controls for global settings

## Tech Stack

- Next.js 14 with App Router
- SQLite database with Prisma ORM
- NextAuth.js for authentication
- OpenAI integration via AI SDK
- Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables
4. Set up the database:
   \`\`\`bash
   npx prisma migrate dev
   npm run init-db
   \`\`\`
5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Environment Variables

- `DATABASE_URL`: SQLite database URL
- `NEXTAUTH_URL`: URL of your application
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `OPENAI_API_KEY`: OpenAI API key

## Deployment

This project is ready to be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Set the required environment variables
4. Deploy

## License

This project is licensed under the MIT License.
\`\`\`

Let's create a .env.example file:

\`\`\`plaintext file=".env.example"
# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key
\`\`\`
