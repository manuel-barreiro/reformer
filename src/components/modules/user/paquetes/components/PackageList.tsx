import React from "react"
import { Package } from "@/components/modules/user/paquetes/utils/mockPackages"
import PackageCard from "@/components/modules/user/paquetes/components/PackageCard"

export default function PackageList({ packages }: { packages: Package[] }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-3 p-0 md:flex-row md:p-10">
      {packages.map((pack) => (
        <PackageCard key={pack.id} pack={pack} />
      ))}
    </div>
  )
}
