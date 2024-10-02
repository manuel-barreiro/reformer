import { ButtonCaretRight } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function SideMenuButton({
  title,
  href,
}: {
  title: string
  href: string
}) {
  return (
    <Link key={title} href={href} className="w-full">
      <Button className="w-full rounded-lg bg-pearlVariant py-0 text-xs text-grey_pebble duration-300 ease-in-out hover:bg-grey_pebble hover:text-pearl sm:text-sm md:justify-between md:px-6 md:py-8 md:text-xl">
        <span>{title}</span>
        <ButtonCaretRight className="hidden h-5 w-5 md:block" />
      </Button>
    </Link>
  )
}
