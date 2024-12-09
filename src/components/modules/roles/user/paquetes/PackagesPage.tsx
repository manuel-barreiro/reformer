"use client"

import React, { useState, useMemo } from "react"
import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"
import PackageList from "./components/PackageList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PurchasedPackageWithClassPackage } from "@/actions/purchased-packages"
import { isExpired } from "@/lib/timezone-utils"

interface PackagesPageProps {
  initialPackages: PurchasedPackageWithClassPackage[]
}

export default function PackagesPage({ initialPackages }: PackagesPageProps) {
  const [filter, setFilter] = useState<string>("ACTIVOS")

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pack) => {
      if (filter === "ACTIVOS") {
        return (
          pack.status === "active" &&
          pack.remainingClasses > 0 &&
          !isExpired(new Date(pack.expirationDate))
        )
      } else {
        return (
          pack.status !== "active" ||
          pack.remainingClasses === 0 ||
          isExpired(new Date(pack.expirationDate))
        )
      }
    })
  }, [initialPackages, filter])

  return (
    <section className="h-full w-full">
      <HeaderToggle
        title="Mis Paquetes"
        filterOptions={["ACTIVOS", "INACTIVOS"]}
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      <ScrollArea className="h-auto w-full overflow-y-auto md:h-[560px]">
        <PackageList packages={filteredPackages} />
      </ScrollArea>
    </section>
  )
}
