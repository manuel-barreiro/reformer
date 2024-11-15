"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GoogleSignInIcon } from "@/assets/icons"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react" // Add this import

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
      const externalUrl = "https://www.reformer.com.ar/sign-in"

      // Try multiple approaches for external browser
      try {
        // Attempt 1: Universal Links / App Links
        window.location.replace(externalUrl)

        // Attempt 2: Custom scheme
        setTimeout(() => {
          window.location.href = `googlechrome:${externalUrl}`
        }, 100)

        // Attempt 3: Direct navigation
        setTimeout(() => {
          window.open(externalUrl, "_system")
        }, 200)
      } catch (e) {
        console.error("Failed to open external browser:", e)
      }
    } else {
      signIn("google", { callbackUrl })
    }
  }

  return (
    <div className="w-full space-y-4">
      {isInstagram && (
        <div className="rounded-md bg-amber-50 p-4">
          <p className="text-center text-sm text-amber-800">
            ⚠️ Para iniciar sesión con Google:
            <br />
            1. Copiá este link:{" "}
            <span className="font-medium">www.reformer.com.ar</span>
            <br />
            2. Abrilo en Chrome o Safari
          </p>
        </div>
      )}

      <Button
        type="button"
        onClick={handleGoogleSignIn}
        variant="outline"
        className="w-full py-6 font-dm_sans text-midnight duration-300 ease-in-out hover:border hover:border-midnight"
      >
        <GoogleSignInIcon className="mr-2 h-5 w-5" />
        {isInstagram ? (
          <>
            ABRIR EN NAVEGADOR
            <ExternalLink className="ml-2 h-4 w-4" />
          </>
        ) : (
          "SIGN IN WITH GOOGLE"
        )}
      </Button>
    </div>
  )
}
