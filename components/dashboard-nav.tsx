import { LayoutDashboard, MessageSquare, CreditCard } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Chatbots",
    href: "/dashboard/chatbots",
    icon: <MessageSquare className="mr-2 h-4 w-4" />,
  },
  {
    title: "Assinatura",
    href: "/dashboard/subscription",
    icon: <CreditCard className="mr-2 h-4 w-4" />,
  },
]
