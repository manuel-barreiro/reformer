import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import React from "react"

export default function DiscountCoupon() {
  return (
    <div className="flex h-full w-full max-w-[450px] flex-col items-start justify-evenly gap-3 border-[2px] border-grey_pebble bg-midnight/60 px-5 py-6 md:px-10">
      <p className="font-dm_mono">¿Tenés un cupón de descuento?</p>
      <div className="relative h-auto w-full">
        <Input
          type="text"
          className="focus:shadow-outline h-full w-full rounded-none border-0 border-b-[2px] border-pearl/70 bg-transparent ring-0 focus:border-midnight/60 focus:ring-0 focus:ring-midnight/60 focus:ring-offset-0"
        />
        <ChevronRight className="absolute right-0 top-1 h-7 w-7 text-pearl/70" />
      </div>
    </div>
  )
}
