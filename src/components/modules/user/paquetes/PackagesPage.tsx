import React from "react"
import HeaderToggle from "@/components/modules/user/common/HeaderToggle"
import { mockPackages } from "@/components/modules/user/paquetes/utils/mockPackages"
import PackageCard from "@/components/modules/user/paquetes/components/PackageCard"

export default function PackagesPage() {
  return (
    <>
      <HeaderToggle
        title="Mis Paquetes"
        filterOptions={["ACTIVOS", "INACTIVOS"]}
      />

      <div className="flex items-center justify-center gap-3 p-10">
        {mockPackages.map((pack) => (
          <PackageCard key={pack.id} pack={pack} />
        ))}
      </div>
    </>
  )
}
