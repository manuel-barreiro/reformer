"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  return (
    <Button
      className="hidden w-[80%] items-center justify-between rounded-xl bg-midnight px-6 py-3 text-xl md:flex"
      onClick={async () => await signOut({ callbackUrl: "/sing-in" })}
    >
      <span>SIGN OUT</span>
      <LogOut />
    </Button>
  )
}
