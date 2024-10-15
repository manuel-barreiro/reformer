"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogoutIcon } from "@/assets/icons"

export default function LogoutButtonDesktop() {
  return (
    <Button
      className="w-full items-center justify-center rounded-lg bg-rust px-6 py-3 text-lg text-pearl hover:bg-rust/90 xl:justify-between"
      onClick={async () => await signOut({ callbackUrl: "/sing-in" })}
    >
      <span>SIGN OUT</span>
      <LogoutIcon className="hidden h-4 w-4 xl:block" />
    </Button>
  )
}
