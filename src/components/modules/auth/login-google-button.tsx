"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GoogleSignInIcon } from "@/assets/icons"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react" // Add Check import

export default function GoogleLoginButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/paquetes"
  const [isInstagram, setIsInstagram] = useState(false)
  const [copied, setCopied] = useState(false)
  const externalUrl = "https://www.reformer.com.ar/sign-in"

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsInstagram(userAgent.includes("instagram"))
  }, [])

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(externalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 15000) // Reset after 15 seconds
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="w-full space-y-4">
      {isInstagram && (
        <div className="rounded-md bg-pearlVariant p-6">
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-rust">
              ⚠️ Para iniciar sesión con Google necesitás abrir esta página en
              tu navegador
            </p>

            <Button
              onClick={copyToClipboard}
              type="button"
              variant="outline"
              className={`mx-auto flex w-full items-center justify-center gap-2 py-4 ${copied ? "border-green-600 text-green-600 hover:bg-green-50" : "border-rust text-rust hover:bg-rust/10"}`}
            >
              <span className="font-medium">www.reformer.com.ar</span>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            <p className="text-center text-xs text-rust">
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
