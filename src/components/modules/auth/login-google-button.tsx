"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GoogleSignInIcon } from "@/assets/icons"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function GoogleLoginButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/paquetes"
  const [isInstagram, setIsInstagram] = useState(false)

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsInstagram(userAgent.includes("instagram"))
  }, [])

  const handleGoogleSignIn = () => {
    if (isInstagram) {
      // Open in default browser
      window.open("https://www.reformer.com.ar/sign-in", "_blank")
    } else {
      signIn("google", { callbackUrl })
    }
  }

  return (
    <div className="w-full">
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        variant="outline"
        className="w-full py-6 font-dm_sans text-midnight duration-300 ease-in-out hover:border hover:border-midnight"
      >
        <GoogleSignInIcon className="mr-2 h-5 w-5" />
        SIGN IN WITH GOOGLE
      </Button>

      {isInstagram && (
        <p className="mt-2 text-center text-sm text-rust">
          Para iniciar sesión con Google, serás redirigido a tu navegador
          predeterminado
        </p>
      )}
    </div>
  )
}
