import type React from "react"
import { Home, LayoutDashboard, Settings, User, HelpCircle } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType
  admin?: boolean
}

const DashboardNav: React.FC = () => {
  const items: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Overview",
      href: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Need Help",
      href: "/dashboard/admin/need-help",
      icon: HelpCircle,
      admin: true,
    },
  ]

  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <a href={item.href}>
              <item.icon />
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default DashboardNav
