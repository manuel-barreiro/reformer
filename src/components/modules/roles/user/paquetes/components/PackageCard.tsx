import React from "react"
import { Package } from "@/components/modules/roles/user/paquetes/utils/mockPackages"
import { cn } from "@/lib/utils"

export default function PackageCard({ pack }: { pack: Package }) {
  return (
    <div
      className={cn(
        "flex h-[180px] w-full flex-col rounded-xl bg-pearlVariant p-4 md:h-[250px] md:p-6",
        !pack.isActive && "text-grey_pebble/40"
      )}
    >
      <div className="flex flex-grow flex-col justify-start">
        <h1 className="mb-2 font-dm_mono text-base font-semibold uppercase">
          {`x${pack.classQuantity} CLASES / ${pack.activity}`}
        </h1>

        <p className="text-sm">
          {pack.activity === "YOGA"
            ? `${pack.classQuantity} clases de yoga HATCHA y/o VINYASA a elección`
            : `${pack.classQuantity} clases de pilates POWER STRENTGH CORE y/o LOWER BODY BURN`}
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm">Duración: 1 mes</p>
        <p className="mt-auto w-full border-t border-dashed border-grey_pebble pt-3 text-right font-dm_mono text-sm sm:text-base md:text-lg">
          <span className="font-semibold">total</span>
          {` $${pack.amount.toLocaleString("es-AR")}`}
        </p>
      </div>
    </div>
  )
}