// filepath: c:\Users\manue\Desktop\Proyectos\reformer\src\components\modules\roles\admin\paquetes\AdminPackagesPage.tsx
"use client"

import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PackageList from "./PackageList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClassPackage } from "@prisma/client"
// import { useRouter } from "next/navigation" // Remove if not used
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddPackageForm } from "./components/AddPackageForm"
import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"

interface AdminPackagesPageProps {
  initialPackages: ClassPackage[]
}

type PackageFilter = "TODOS" | "VISIBLE" | "OCULTO"

export default function AdminPackagesPage({
  initialPackages,
}: AdminPackagesPageProps) {
  const [packages, setPackages] = useState(initialPackages)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false) // Renamed state for clarity
  const [filter, setFilter] = useState<PackageFilter>("TODOS")
  // const router = useRouter() // Remove if not used

  const handlePackageUpdate = (updatedPackage: ClassPackage) => {
    setPackages((prevPackages) => {
      const index = prevPackages.findIndex((p) => p.id === updatedPackage.id)
      if (index !== -1) {
        const newPackages = [...prevPackages]
        newPackages[index] = updatedPackage
        return newPackages.sort((a, b) => a.classCount - b.classCount) // Keep sorted
      }
      // If it's a new package (from AddPackageForm)
      return [...prevPackages, updatedPackage].sort(
        (a, b) => a.classCount - b.classCount
      ) // Keep sorted
    })
    setIsAddModalOpen(false) // Close modal on success
  }

  const handlePackageDelete = (deletedPackageId: string) => {
    setPackages((prevPackages) =>
      prevPackages.filter((p) => p.id !== deletedPackageId)
    )
  }

  const filteredPackages = useMemo(() => {
    switch (filter) {
      case "VISIBLE":
        return packages.filter((p) => p.isVisible)
      case "OCULTO":
        return packages.filter((p) => !p.isVisible)
      case "TODOS":
      default:
        return packages
    }
  }, [packages, filter])

  // Define the action button separately for clarity
  const addPackageButton = (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogTrigger asChild>
        <Button className="flex shrink-0 items-center gap-1 bg-midnight text-pearl hover:bg-midnight/90">
          <PlusIcon size={18} />
          <span className="hidden sm:inline">Agregar Paquete</span>
          <span className="sm:hidden">Agregar</span>{" "}
          {/* Shorter text for small screens */}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Paquete</DialogTitle>
        </DialogHeader>
        <AddPackageForm onSuccess={handlePackageUpdate} />
      </DialogContent>
    </Dialog>
  )

  return (
    // Use flex-col for overall structure
    <section className="flex h-full w-full flex-col">
      {/* Header section */}
      <HeaderToggle
        // title="Paquetes" // Pass title to HeaderToggle
        filterOptions={["TODOS", "VISIBLE", "OCULTO"]}
        currentFilter={filter}
        onFilterChange={(newFilter) => setFilter(newFilter as PackageFilter)}
        actionButton={addPackageButton} // Pass the button here
      />

      {/* Content Area - takes remaining height */}
      <ScrollArea className="flex-grow overflow-y-auto">
        {" "}
        {/* Use flex-grow */}
        <PackageList
          packages={filteredPackages}
          onPackageUpdate={handlePackageUpdate}
          onPackageDelete={handlePackageDelete}
        />
      </ScrollArea>
    </section>
  )
}
