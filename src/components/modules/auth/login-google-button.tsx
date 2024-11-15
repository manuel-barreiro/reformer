"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GoogleSignInIcon } from "@/assets/icons"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function GoogleLoginButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/paquetes"
  const [isInstagram, setIsInstagram] = useState(false)
  const { toast } = useToast()
  const externalUrl = "https://www.reformer.com.ar/sign-in"

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsInstagram(userAgent.includes("instagram"))
  }, [])

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    try {
      await navigator.clipboard.writeText(externalUrl)
      toast({
        title: "¡Link copiado!",
        description: "Pegalo en Chrome o Safari para iniciar sesión",
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="w-full space-y-4">
      {isInstagram && (
        <div className="rounded-md bg-amber-50 p-6">
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-amber-800">
              ⚠️ Para iniciar sesión con Google necesitás abrir esta página en
              tu navegador
            </p>

            <Button
              onClick={copyToClipboard}
              type="button"
              variant="outline"
              className="mx-auto flex w-full items-center justify-center gap-2 border-rust py-4 text-rust hover:bg-rust/10"
            >
              <span className="font-medium">www.reformer.com.ar</span>
              <Copy className="h-4 w-4" />
            </Button>

            <p className="text-center text-xs text-amber-700">
              1. Copiá el link presionando el botón de arriba
              <br />
              2. Abrilo en Chrome o Safari
            </p>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={() => !isInstagram && signIn("google", { callbackUrl })}
        variant="outline"
        disabled={isInstagram}
        className="w-full py-6 font-dm_sans text-midnight duration-300 ease-in-out hover:border hover:border-midnight disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GoogleSignInIcon className="mr-2 h-5 w-5" />
        {isInstagram ? "NO DISPONIBLE EN INSTAGRAM" : "SIGN IN WITH GOOGLE"}
      </Button>
    </div>
  )
}
