"use client"
import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { TermsAndConditionsDialog } from "@/components/modules/roles/common/TermsAndConditionsDialog"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isDialogTrigger?: boolean // Add the optional flag here
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.isDialogTrigger ? (
                // If it's a dialog trigger, wrap with the dialog
                <TermsAndConditionsDialog>
                  <SidebarMenuButton
                    size="sm"
                    className="w-full cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </TermsAndConditionsDialog>
              ) : (
                // Otherwise, render as a link
                <SidebarMenuButton asChild size="sm">
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
