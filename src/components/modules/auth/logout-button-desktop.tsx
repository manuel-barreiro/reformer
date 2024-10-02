"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogoutIcon } from "@/assets/icons"

export default function LogoutButtonDesktop() {
  return (
    <Button
      className="w-full items-center justify-between rounded-xl bg-midnight px-6 py-3 text-xl"
      onClick={async () => await signOut({ callbackUrl: "/sing-in" })}
    >
      <span>SIGN OUT</span>
      <LogoutIcon className="h-4 w-4" />
    </Button>
  )
}
