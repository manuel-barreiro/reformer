"use client"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { OrderSuccessIcon, OrderFailedIcon } from "@/assets/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function OrderStatus() {
  const pathname = usePathname()
  return (
    <div
      className={cn(
        "flex min-h-[90dvh] items-center justify-center text-grey_pebble",
        pathname === "/checkout/success" ? "bg-grey_pebble" : "bg-rust"
      )}
    >
      <div className="relative w-full max-w-xs rounded-3xl bg-pearl p-10 sm:max-w-md sm:p-12">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 transform rounded-full bg-pearlVariant p-5">
          {pathname === "/checkout/success" ? (
            <OrderSuccessIcon />
          ) : (
            <OrderFailedIcon />
          )}
        </div>
        <h1 className="mb-4 text-center font-marcellus text-xl font-medium sm:text-2xl lg:text-3xl">
          {pathname === "/checkout/success"
            ? "TU PAGO FUE EXITOSO :)"
            : "ALGO SALIÓ MAL :("}
        </h1>
        <p className="mb-6 text-center font-dm_mono text-xs font-medium sm:text-sm">
          {pathname === "/checkout/success"
            ? "DIRIGITE A TUS PAQUETES PARA VER TU COMPRA Y AGENDA TUS CLASES PARA EMPEZAR A TUNEARTE CON ONDA"
            : "UPS! ALGO NO FUNCIONÓ. INTENTA NUEVAMENTE O CONTACTANOS PARA RESOLVERLO!"}
        </p>
        {pathname === "/checkout/success" ? (
          <Link href="/paquetes" className="flex w-full justify-center">
            <button
              type="submit"
              className="mt-4 h-10 w-full rounded-lg border border-pearl/80 bg-[#110f10] text-[16px] text-sm font-light text-pearl/80 outline-pearl/80 transition-all duration-100 ease-in-out hover:bg-[#110f10]/40 hover:outline lg:mt-0 lg:w-[60%]"
            >
              mis paquetes
            </button>
          </Link>
        ) : (
          <Link href="/checkout" className="flex w-full justify-center">
            <button
              type="submit"
              className="mt-4 h-10 w-full rounded-lg border border-pearl/80 bg-[#110f10] text-[16px] text-sm font-light text-pearl/80 outline-pearl/80 transition-all duration-100 ease-in-out hover:bg-[#110f10]/40 hover:outline lg:mt-0 lg:w-[60%]"
            >
              volver a checkout
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
