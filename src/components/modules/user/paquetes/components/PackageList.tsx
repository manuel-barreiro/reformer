import React from "react"
import { Package } from "@/components/modules/user/paquetes/utils/mockPackages"
import PackageCard from "@/components/modules/user/paquetes/components/PackageCard"

export default function PackageList({ packages }: { packages: Package[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 py-10 md:max-w-[600px] md:grid-cols-2 md:p-10 lg:max-w-[800px]">
      {packages.map((pack) => (
        <PackageCard key={pack.id} pack={pack} />
      ))}
    </div>
  )
}
