"use client"
import { signOut } from "next-auth/react"
import { LogoutIcon } from "@/assets/icons"
import { Button } from "@/components/ui/button"

export default function LogoutButtonMobile() {
  return (
    <Button
      variant="outline"
      onClick={async () => await signOut({ callbackUrl: "/sing-in" })}
      className="bg-transparent hover:bg-grey_pebble/10 xl:hidden"
    >
      <LogoutIcon className="h-5 w-5 text-midnight sm:h-5 sm:w-5" />
    </Button>
  )
}
