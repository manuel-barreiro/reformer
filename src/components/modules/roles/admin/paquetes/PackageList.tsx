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
    <div className="grid grid-cols-1 gap-3 py-5 sm:max-w-[600px] sm:grid-cols-2 md:max-w-[1000px] md:grid-cols-3 md:p-10">
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
