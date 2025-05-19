import { formatDistanceToNow } from "date-fns"
import { Bot, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RecentActivityProps {
  chatbots: any[]
}

export function RecentActivity({ chatbots }: RecentActivityProps) {
  if (chatbots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Bot className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {chatbots.map((chatbot) => {
        // Convert string date to Date object if needed
        const createdAt = typeof chatbot.createdAt === "string" ? new Date(chatbot.createdAt) : chatbot.createdAt

        return (
          <div key={chatbot.id} className="flex items-start space-x-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{chatbot.name}</p>
              <p className="text-sm text-muted-foreground">{chatbot.isPublic ? "Public" : "Private"} chatbot</p>
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(createdAt, { addSuffix: true })}
              </p>
            </div>
            <div className="flex space-x-1">
              <Link href={`/dashboard/chatbots/${chatbot.id}/playground`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                  <span className="sr-only">Playground</span>
                </Button>
              </Link>
              <Link href={`/dashboard/chatbots/${chatbot.id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
