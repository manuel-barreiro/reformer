"use client"

import * as React from "react"
import {
  Info,
  CircleDollarSign,
  Package,
  CalendarDays,
  Users,
  User,
  List,
  CalendarCheck,
  LineChart,
} from "lucide-react"
import { NavMain } from "@/components/modules/sidebar/nav-main"
import { NavSecondary } from "@/components/modules/sidebar/nav-secondary"
import { NavUser } from "@/components/modules/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Logo, ReformerIcon } from "@/assets/icons"
import Link from "next/link"

const adminMenuItems = [
  {
    title: "Pagos",
    url: "/admin/pagos",
    icon: CircleDollarSign,
  },
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LineChart,
  },
  {
    title: "Paquetes",
    url: "/admin/paquetes",
    icon: Package,
  },
  {
    title: "Calendario",
    url: "/admin/calendario",
    icon: CalendarDays,
  },
  {
    title: "Usuarios",
    url: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Categorias",
    url: "/admin/categorias",
    icon: List,
  },
]

const userMenuItems = [
  {
    title: "Paquetes",
    url: "/paquetes",
    icon: Package,
  },
  {
    title: "Reservas",
    url: "/reservas",
    icon: CalendarCheck,
  },
  {
    title: "Calendario",
    url: "/calendario",
    icon: CalendarDays,
  },
  {
    title: "Perfil",
    url: "/perfil",
    icon: User,
  },
]

const secondaryNavItems = [
  {
    title: "Ayuda",
    url: "#",
    icon: Info,
  },
]

interface UserData {
  name: string
  email: string
  avatar: string
  role: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserData
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const menuItems = user.role === "admin" ? adminMenuItems : userMenuItems

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ReformerIcon className="w-16" />
                </div>
                <span>
                  <Logo className="w-28" />
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
        <NavSecondary items={secondaryNavItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
