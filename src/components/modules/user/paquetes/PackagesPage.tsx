"use client"

import React, { useState, useMemo } from "react"
import HeaderToggle from "@/components/modules/user/common/HeaderToggle"
import { Package } from "@/components/modules/user/paquetes/utils/mockPackages"
import PackageList from "./components/PackageList"

interface PackagesPageProps {
  initialPackages: Package[]
}

export default function PackagesPage({ initialPackages }: PackagesPageProps) {
  const [filter, setFilter] = useState<string>("ACTIVOS")

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pack: Package) => {
      return filter === "ACTIVOS" ? pack.isActive : !pack.isActive
    })
  }, [initialPackages, filter])

  return (
    <>
      <HeaderToggle
        title="Mis Paquetes"
        filterOptions={["ACTIVOS", "INACTIVOS"]}
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <PackageList packages={filteredPackages} />
    </>
  )
}