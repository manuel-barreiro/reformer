"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GoogleSignInIcon } from "@/assets/icons"

export default function GoogleLoginButton() {
  return (
    <Button
      type="button"
      onClick={() => signIn("google", { redirectTo: "/paquetes" })}
      variant="outline"
      className="w-full py-6 font-dm_sans text-midnight duration-300 ease-in-out hover:border hover:border-midnight"
    >
      <GoogleSignInIcon className="mr-2 h-5 w-5" />
      SIGN IN WITH GOOGLE
    </Button>
  )
}
