"use client"

import React, { useState, useMemo } from "react"
import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"
import PackageList from "./components/PackageList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PurchasedPackageWithClassPackage } from "@/actions/purchased-packages"
import { isExpired } from "@/lib/timezone-utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package } from "lucide-react"

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

  const buyButton = (
    <Button
      asChild
      className="flex w-full shrink-0 items-center gap-1 bg-rust font-dm_mono text-pearl hover:bg-rust/90"
    >
      <Link href="/checkout" className="flex w-full items-center gap-3">
        <Package size={18} />
        <span className="">COMPRAR PAQUETE</span>
      </Link>
    </Button>
  )

  return (
    <section className="h-full w-full">
      <HeaderToggle
        filterOptions={["ACTIVOS", "INACTIVOS"]}
        currentFilter={filter}
        onFilterChange={setFilter}
        actionButton={buyButton}
      />
      <ScrollArea className="h-auto w-full overflow-y-auto md:h-[500px]">
        <PackageList packages={filteredPackages} />
      </ScrollArea>
    </section>
  )
}
