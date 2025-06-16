import { Home, LayoutDashboard, Settings, User, Users, Database } from "lucide-react"

export const dashboardNavItems = [
  {
    title: "Geral",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Administração",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    adminOnly: true,
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Banco de Dados",
    href: "/dashboard/admin/database",
    icon: Database,
    adminOnly: true,
  },
  {
    title: "Perfil",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]
