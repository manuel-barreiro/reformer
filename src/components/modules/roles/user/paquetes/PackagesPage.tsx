"use client"

import React, { useState, useMemo } from "react"
import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"
import PackageList from "./components/PackageList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PurchasedPackageWithClassPackage } from "@/actions/purchased-packages"

interface PackagesPageProps {
  initialPackages: PurchasedPackageWithClassPackage[]
}

export default function PackagesPage({ initialPackages }: PackagesPageProps) {
  const [filter, setFilter] = useState<string>("ACTIVOS")

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pack) => {
      return filter === "ACTIVOS"
        ? pack.status === "active"
        : pack.status !== "active"
    })
  }, [initialPackages, filter])

  return (
    <section className="h-full">
      <HeaderToggle
        title="Mis Paquetes"
        filterOptions={["ACTIVOS", "INACTIVOS"]}
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      <ScrollArea className="w-full overflow-y-auto md:h-96">
        <PackageList packages={filteredPackages} />
      </ScrollArea>
    </section>
  )
}
