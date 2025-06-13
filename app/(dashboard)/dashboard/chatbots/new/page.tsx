import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { checkUserLimits } from "@/lib/usage-limits"
import NewChatbotForm, { UserLimits } from "@/components/dashboard/new-chatbot-form"

export default async function NewChatbotPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const limits: UserLimits = await checkUserLimits(session.user.id)

  return <NewChatbotForm limits={limits} />
}
