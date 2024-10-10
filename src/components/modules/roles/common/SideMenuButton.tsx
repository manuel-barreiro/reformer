"use client"
import { ButtonCaretRight } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function SideMenuButton({
  title,
  href,
}: {
  title: string
  href: string
}) {
  const pathname = usePathname()
  return (
    <Link key={title} href={href} className="w-full">
      <Button
        className={cn(
          "w-full rounded-lg bg-pearlVariant py-0 text-xs text-grey_pebble duration-300 ease-in-out hover:bg-grey_pebble hover:text-pearl sm:py-4 sm:text-sm lg:justify-between lg:px-6 lg:py-6 lg:text-lg",
          pathname === href && "bg-grey_pebble text-pearl" // highlight the active link
        )}
      >
        <span>{title}</span>
        <ButtonCaretRight className="hidden h-4 w-4 lg:block" />
      </Button>
    </Link>
  )
}
