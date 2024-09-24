"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignIn() {
  return (
    <Button onClick={() => signIn("credentials", { redirectTo: "/paquetes" })}>
      Log In
    </Button>
  )
}
