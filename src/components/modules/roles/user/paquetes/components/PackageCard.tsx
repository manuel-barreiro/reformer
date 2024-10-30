import React from "react"
import { cn } from "@/lib/utils"
import { PurchasedPackageWithClassPackage } from "@/actions/purchased-packages"
import { Badge } from "@/components/ui/badge"
import { isExpired } from "@/lib/timezone-utils"

export default function PackageCard({
  pack,
}: {
  pack: PurchasedPackageWithClassPackage
}) {
  const expired =
    pack.status === "expired" || isExpired(new Date(pack.expirationDate))

  return (
    <div
      className={cn(
        "flex h-[200px] w-full flex-col rounded-xl bg-pearlVariant p-4 md:h-[250px] md:p-6",
        (expired || pack.remainingClasses === 0) && "opacity-60"
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
          {pack.remainingClasses > 0 && !expired ? (
            <>
              Te quedan{" "}
              <span className="font-bold">{pack.remainingClasses} clases</span>{" "}
              para reservar correspondientes a este paquete.
            </>
          ) : expired && pack.remainingClasses > 0 ? (
            <>
              Te quedaron{" "}
              <span className="font-bold">{pack.remainingClasses} clases</span>{" "}
              sin utilizar correspondientes a este paquete.
            </>
          ) : (
            "Ya utilizaste todas las clases correspondientes a este paquete."
          )}
        </p>
      </div>

      <div>
        {expired ? (
          <Badge className="mb-2 !w-auto bg-rust hover:bg-rust/80">
            EXPIRADO EL{" "}
            {new Date(pack.expirationDate).toLocaleDateString("es-ES")}
          </Badge>
        ) : (
          <Badge className="mb-2 !w-auto bg-midnight">
            EXPIRA EL{" "}
            {new Date(pack.expirationDate).toLocaleDateString("es-ES")}
          </Badge>
        )}
        {/* <p className="mb-2 text-xs">
          Expira:{" "}
          <span className="font-dm_mono font-bold">
            {new Date(pack.expirationDate).toLocaleDateString("es-ES")}
          </span>
        </p> */}
        <p className="mt-auto w-full border-t border-dashed border-grey_pebble pt-3 text-right font-dm_mono text-sm sm:text-base md:text-lg">
          <span className="font-semibold">total</span>
          {` $${pack.classPackage.price.toLocaleString("es-ES")}`}
        </p>
      </div>
    </div>
  )
}
