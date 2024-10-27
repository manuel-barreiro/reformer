"use client"
import { LogOut, EllipsisVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import Link from "next/link"

export function ReformerDropdownMenu({ items }: { items: any[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="xl:hidden">
        <Button variant="ghost" className="p-0">
          <EllipsisVertical className="h-6 w-6 text-midnight" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20 bg-pearlVariant3 md:w-40">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((item: any) => (
            <DropdownMenuItem key={item.href}>
              <Link href={item.href}>{item.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={async () => await signOut({ callbackUrl: "/sing-in" })}
        >
          <LogOut />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
