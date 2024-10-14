import { BankTransferIcon, CashIcon, CreditCardIcon } from "@/assets/icons"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"

export default function FinalCheckout({
  selectedPackage,
  onCheckout,
}: {
  selectedPackage: { name: string; price: number }
  onCheckout: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      await onCheckout()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-auto w-full max-w-[450px] flex-col justify-between border-[2px] border-grey_pebble bg-midnight/60">
      <div className="flex flex-col items-start gap-3 px-5 py-6 md:px-10 md:py-12">
        <p className="font-dm_mono text-xl">Resumen de compra</p>
        <div className="w-full border-[1px] border-pearl/30 bg-midnight/70 p-3">
          <p className="text-center text-base md:text-xl">
            PAQUETE {selectedPackage.name}
          </p>
        </div>
        <div className="mt-5 flex w-full flex-col gap-3">
          <p className="font-semibold">MEDIOS DE PAGO</p>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-6 w-6" />
            <span>Tarjeta de crédito</span>
          </div>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
          <div className="flex items-center gap-2">
            <CashIcon className="h-6 w-6" />
            <span>Efectivo</span>
          </div>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
          <div className="flex items-center gap-2">
            <BankTransferIcon className="h-6 w-6" />
            <span>Transferencia Bancaria</span>
          </div>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full flex-1 border-t-[2px] border-grey_pebble p-6 font-dm_sans text-lg font-bold duration-300 ease-in-out hover:bg-pearlVariant2 hover:text-midnight disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            PROCESANDO...
          </span>
        ) : (
          "REALIZAR PAGO"
        )}
      </button>
    </div>
  )
}
