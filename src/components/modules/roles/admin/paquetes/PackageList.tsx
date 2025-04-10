import React from "react"
import { ClassPackage } from "@prisma/client"
import AdminPackageCard from "@/components/modules/roles/admin/paquetes/AdminPackageCard"

interface PackageListProps {
  packages: ClassPackage[]
  onPackageUpdate: (updatedPackage: ClassPackage) => void
  onPackageDelete: (deletedPackageId: string) => void
}

export default function PackageList({
  packages,
  onPackageUpdate,
  onPackageDelete,
}: PackageListProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-5 sm:grid sm:grid-cols-2 sm:p-10 lg:grid-cols-3 xl:grid-cols-4">
      {packages.map((pack) => (
        <AdminPackageCard
          key={pack.id}
          pack={pack}
          onPackageUpdate={onPackageUpdate}
          onPackageDelete={onPackageDelete}
        />
      ))}
    </div>
  )
}
