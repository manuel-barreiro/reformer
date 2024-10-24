import React from "react"
import { cn } from "@/lib/utils"
import { PurchasedPackageWithClassPackage } from "@/actions/purchased-packages"

export default function PackageCard({
  pack,
}: {
  pack: PurchasedPackageWithClassPackage
}) {
  return (
    <div
      className={cn(
        "flex h-[180px] w-full flex-col rounded-xl bg-pearlVariant p-4 md:h-[250px] md:p-6",
        pack.status !== "active" && "text-grey_pebble/40"
      )}
    >
      <div className="flex flex-grow flex-col justify-start">
        <h1 className="mb-2 font-dm_mono text-base font-semibold uppercase">
          {pack.classPackage.name}
        </h1>

        <p className="text-sm">
          {pack.classPackage.description ||
            `${pack.classPackage.classCount} clases`}
        </p>

        <p className="mt-3 text-sm">
          Te quedan{" "}
          <span className="font-bold">{pack.remainingClasses} clases</span> para
          reservar correspondientes a este paquete.
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs">
          Expira:{" "}
          <span className="font-dm_mono font-bold">
            {pack.expirationDate.toLocaleDateString("es-ES")}
          </span>
        </p>
        <p className="mt-auto w-full border-t border-dashed border-grey_pebble pt-3 text-right font-dm_mono text-sm sm:text-base md:text-lg">
          <span className="font-semibold">total</span>
          {` $${pack.classPackage.price.toLocaleString("es-ES")}`}
        </p>
      </div>
    </div>
  )
}
