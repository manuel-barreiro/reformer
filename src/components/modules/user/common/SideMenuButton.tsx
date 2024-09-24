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
      <Button className="bg-pearlVariant flex w-full items-center justify-between rounded-xl px-6 py-8 text-xl text-grey_pebble duration-300 ease-in-out hover:bg-grey_pebble hover:text-pearl">
        <span>{title}</span>
        <ButtonCaretRight className="h-5 w-5" />
      </Button>
    </Link>
  )
}
