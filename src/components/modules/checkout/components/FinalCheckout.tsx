import { BankTransferIcon, CashIcon, CreditCardIcon } from "@/assets/icons"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox" // Assuming you have this component
import { Label } from "@/components/ui/label" // Assuming you have this component
import { TermsAndConditionsDialog } from "@/components/modules/roles/common/TermsAndConditionsDialog"

export default function FinalCheckout({
  selectedPackage,
  onCheckout,
}: {
  selectedPackage: { name: string; price: number }
  onCheckout: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false) // State for checkbox

  const handleCheckout = async () => {
    if (!termsAccepted) return // Prevent checkout if terms not accepted
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
        {/* Terms and Conditions Checkbox */}
        <div className="mt-4 flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))}
            className="border-pearl data-[state=checked]:bg-pearl data-[state=checked]:text-midnight"
          />
          <Label htmlFor="terms" className="text-sm font-medium leading-none">
            Acepto los{" "}
            <TermsAndConditionsDialog>
              <span className="cursor-pointer font-bold underline hover:text-pearlVariant2">
                términos y condiciones
              </span>
            </TermsAndConditionsDialog>{" "}
            de Reformer.
          </Label>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading || !termsAccepted} // Disable if loading or terms not accepted
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
