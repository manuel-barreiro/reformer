"use client"
import { signOut } from "next-auth/react"
import { LogoutIcon } from "@/assets/icons"

export default function LogoutButtonMobile() {
  return (
    <button onClick={async () => await signOut({ callbackUrl: "/sing-in" })}>
      <LogoutIcon className="h-4 w-4 text-midnight sm:h-5 sm:w-5 md:hidden" />
    </button>
  )
}
