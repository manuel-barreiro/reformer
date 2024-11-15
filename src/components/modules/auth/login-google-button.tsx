"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GoogleSignInIcon } from "@/assets/icons"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ExternalLink, Copy } from "lucide-react" // Add Copy icon
import { useToast } from "@/components/ui/use-toast" // Add toast if available

export default function GoogleLoginButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/paquetes"
  const [isInstagram, setIsInstagram] = useState(false)
  const toast = useToast()
  const externalUrl = "https://www.reformer.com.ar/sign-in"

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsInstagram(userAgent.includes("instagram"))
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(externalUrl)
      toast?.toast({
        title: "¡Link copiado!",
        description: "Pegalo en Chrome o Safari para iniciar sesión",
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleGoogleSignIn = () => {
    if (isInstagram) {
      // Simple redirect with fallback
      try {
        window.open(externalUrl, "_blank")
      } catch (e) {
        console.error("Failed to open:", e)
        copyToClipboard()
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
            1. Copiá el link haciendo click aquí:
            <button
              onClick={copyToClipboard}
              className="ml-2 inline-flex items-center text-rust hover:text-rust/80"
            >
              www.reformer.com.ar <Copy className="ml-1 h-3 w-3" />
            </button>
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
