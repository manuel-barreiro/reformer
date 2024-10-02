import React from "react"
import { Package } from "@/components/modules/user/paquetes/utils/mockPackages"
import PackageCard from "@/components/modules/user/paquetes/components/PackageCard"

export default function PackageList({ packages }: { packages: Package[] }) {
  return (
    <div className="flex w-full items-center justify-center gap-2 p-0 md:gap-3 md:p-10">
      {packages.map((pack) => (
        <PackageCard key={pack.id} pack={pack} />
      ))}
    </div>
  )
}
