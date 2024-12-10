"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import React from "react"

export default function UserAvatar({
  user,
}: {
  user: { name: string; email: string; avatar: string; role: string }
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer rounded-lg">
          <AvatarImage
            src={user.avatar}
            alt={user.name}
            className="rounded-full"
          />
          <AvatarFallback className="rounded-full !bg-midnight !text-pearl">
            {user.name.split("")[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async () => await signOut({ callbackUrl: "/sing-in" })}
          className="flex cursor-pointer items-center gap-2 bg-sidebar-ring !text-sidebar-foreground hover:!bg-sidebar-ring/80"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
