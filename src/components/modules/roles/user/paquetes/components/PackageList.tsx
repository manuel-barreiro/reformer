import React from "react"
import PackageCard from "@/components/modules/roles/user/paquetes/components/PackageCard"
import { PurchasedPackageWithClassPackage } from "@/actions/purchased-packages"

export default function PackageList({
  packages,
}: {
  packages: PurchasedPackageWithClassPackage[]
}) {
  return (
    <div className="grid grid-cols-1 gap-3 py-5 md:max-w-[600px] md:grid-cols-2 md:p-10 lg:max-w-[800px]">
      {packages.map((pack) => (
        <PackageCard key={pack.id} pack={pack} />
      ))}
    </div>
  )
}
