// app/global-error.tsx
"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error in production
    if (process.env.NODE_ENV === "production") {
      console.error("Global Error:", error)
    }
  }, [error])

  return (
    <html>
      <body className="flex h-screen items-center justify-center bg-[#110f10]">
        <div className="w-full max-w-xl space-y-6 rounded-lg border border-pearl/80 bg-[#110f10]/40 p-8 text-center">
          <h1 className="text-2xl font-semibold text-pearl/80">
            ¡Algo salió mal!
          </h1>

          <div className="text-left text-pearl/80">
            <h2 className="text-xl font-semibold">Info del error:</h2>
            <ul className="mt-2 list-disc pl-5">
              {Object.entries(error).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={reset}
              className="w-auto rounded-lg border border-pearl/80 bg-[#110f10] p-3 text-sm font-light text-pearl/80 outline-pearl/80 transition-all duration-100 hover:bg-[#110f10]/40 hover:outline"
            >
              Reintentar
            </button>

            <Link href="/">
              <button
                type="button"
                className="w-auto rounded-lg border border-pearl/80 bg-[#110f10] p-3 text-sm font-light text-pearl/80 outline-pearl/80 transition-all duration-100 hover:bg-[#110f10]/40 hover:outline"
              >
                Ir al inicio
              </button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
