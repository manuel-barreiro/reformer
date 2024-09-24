import React from "react"
import {
  Package,
  mockPackages,
} from "@/components/modules/user/paquetes/utils/mockPackages"

export default function PackageCard({ pack }: { pack: Package }) {
  return (
    <div className="bg-pearlVariant flex h-auto min-w-[50%] flex-col items-start gap-3 rounded-xl p-6">
      <h1 className="font-dm_mono text-lg uppercase">{`x${pack.classQuantity} CLASES / ${pack.activity}`}</h1>
      {pack.activity === "YOGA" ? (
        <p className="text-sm">
          {pack.classQuantity} clases de yoga HATCHA y/o VINYASA <br /> a
          elección
        </p>
      ) : (
        <p className="text-sm">
          {pack.classQuantity} clases de pilates POWER STRENTGH CORE y/o LOWER
          BODY BURN
        </p>
      )}
      <p className="text-sm">Duración: 1 mes</p>

      <p className="w-full border-t border-dashed border-grey_pebble pt-3 text-right font-dm_mono">{`total $${pack.amount.toLocaleString("es-AR")}`}</p>
    </div>
  )
}
