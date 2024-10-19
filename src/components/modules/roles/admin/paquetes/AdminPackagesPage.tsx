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
    <>
      <div className="flex w-full items-center justify-between border-b border-grey_pebble pb-4 font-dm_sans text-xs font-medium uppercase sm:text-sm md:justify-between md:pb-6 md:pl-10 lg:text-lg">
        <div className="flex items-center gap-4">
          <h1 className="py-2">Paquetes</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="aspect-square rounded-full bg-rust p-1 hover:bg-rust/80">
                <PlusIcon size={24} className="text-pearl" />
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
      </div>
      <ScrollArea className="w-full overflow-y-auto md:h-96">
        <PackageList
          packages={packages}
          onPackageUpdate={handlePackageUpdate}
          onPackageDelete={handlePackageDelete}
        />
      </ScrollArea>
    </>
  )
}
