import React from "react"
import PackageCard from "@/components/modules/roles/user/paquetes/components/PackageCard"
import { PurchasedPackageWithClassPackage } from "@/actions/purchased-packages"
import { cn } from "@/lib/utils"

export default function PackageList({
  packages,
}: {
  packages: PurchasedPackageWithClassPackage[]
}) {
  return (
    <div
      className={cn(
        "h-full px-6 py-5 md:p-10",
        packages.length === 0 && "flex items-center justify-center",
        packages.length > 0 &&
          "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}
    >
      {packages.length > 0 ? (
        packages.map((pack) => <PackageCard key={pack.id} pack={pack} />)
      ) : (
        <div className="my-auto text-center text-gray-500">
          No se encontraron paquetes.
        </div>
      )}
    </div>
  )
}
