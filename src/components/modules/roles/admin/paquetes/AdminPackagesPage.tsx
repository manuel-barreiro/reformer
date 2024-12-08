"use client"

import React, { useState } from "react"
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
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddPackageForm } from "./components/AddPackageForm"

interface AdminPackagesPageProps {
  initialPackages: ClassPackage[]
}

export default function AdminPackagesPage({
  initialPackages,
}: AdminPackagesPageProps) {
  const [packages, setPackages] = useState(initialPackages)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handlePackageUpdate = (updatedPackage: ClassPackage) => {
    setPackages((prevPackages) => {
      const index = prevPackages.findIndex((p) => p.id === updatedPackage.id)
      if (index !== -1) {
        const newPackages = [...prevPackages]
        newPackages[index] = updatedPackage
        return newPackages
      }
      return [...prevPackages, updatedPackage]
    })
    setIsOpen(false)
    router.refresh()
  }

  const handlePackageDelete = (deletedPackageId: string) => {
    setPackages((prevPackages) =>
      prevPackages.filter((p) => p.id !== deletedPackageId)
    )
    router.refresh()
  }

  return (
    <section className="h-full w-full">
      <div className="flex w-full items-center justify-between gap-4 border-b border-grey_pebble pb-4 font-dm_sans text-xs sm:text-sm md:pb-6 md:pl-10 lg:text-lg">
        <h1 className="py-2 font-marcellus text-2xl font-bold uppercase">
          Paquetes
        </h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="aspect-square rounded-full bg-rust p-2 hover:bg-rust/80">
              <PlusIcon size={24} className="text-pearl" />
              <span>Agregar Paquete</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Paquete</DialogTitle>
            </DialogHeader>
            <AddPackageForm onSuccess={handlePackageUpdate} />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-full w-full overflow-y-auto md:h-[560px]">
        <PackageList
          packages={packages}
          onPackageUpdate={handlePackageUpdate}
          onPackageDelete={handlePackageDelete}
        />
      </ScrollArea>
    </section>
  )
}
