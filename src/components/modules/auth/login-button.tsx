"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

export function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/paquetes"

  return (
    <Button onClick={() => signIn("credentials", { callbackUrl })}>
      Log In
    </Button>
  )
}
