"use client"

import { LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"
import { Badge } from "@/components/ui/badge"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    role: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group/avatar rounded-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-full"
                />
                <AvatarFallback className="rounded-full !bg-sidebar-foreground !text-sidebar-accent-foreground group-hover/avatar:!bg-sidebar-accent-foreground group-hover/avatar:!text-sidebar-foreground">
                  {user.name.split("")[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{user.name}</span>
                  {user.role !== "user" && (
                    <Badge className="!bg-sidebar-foreground text-[8px] uppercase !text-sidebar-accent-foreground group-hover/avatar:!bg-sidebar-accent-foreground group-hover/avatar:!text-sidebar-foreground">
                      {user.role}
                    </Badge>
                  )}
                </div>

                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-full">
                    {" "}
                    {user.name.split("")[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">{user.name}</span>
                    {user.role !== "user" && (
                      <Badge className="!bg-sidebar-foreground text-[8px] uppercase !text-sidebar-accent-foreground group-hover/avatar:!bg-sidebar-accent-foreground group-hover/avatar:!text-sidebar-foreground">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => await signOut({ callbackUrl: "/sing-in" })}
              className="flex cursor-pointer items-center gap-2 bg-sidebar-ring !text-sidebar-foreground hover:!bg-sidebar-ring/80"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
