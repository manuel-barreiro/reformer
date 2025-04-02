import { ColumnDef } from "@tanstack/react-table"
import { ExtendedPurchasedPackage } from "../tabs/UserPackagesTab"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PackageStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

interface UserPackagesColumnsProps {
  editingPackage: string | null
  editForm: {
    remainingClasses: number
    expirationDate: string
  }
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      remainingClasses: number
      expirationDate: string
    }>
  >
  formatDisplayDate: (date: Date) => string
  getStatusBadgeColor: (status: PackageStatus) => string
  handleEdit: (pkg: ExtendedPurchasedPackage) => void
  handleSave: (pkg: ExtendedPurchasedPackage) => Promise<void>
  updatePackageMutation: any
  setEditingPackage: React.Dispatch<React.SetStateAction<string | null>>
  setPackageToDelete: React.Dispatch<React.SetStateAction<string | null>>
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const userPackagesColumns = (
  editingPackage: string | null,
  editForm: {
    remainingClasses: number
    expirationDate: string
  },
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      remainingClasses: number
      expirationDate: string
    }>
  >,
  formatDisplayDate: (date: Date) => string,
  getStatusBadgeColor: (status: PackageStatus) => string,
  handleEdit: (pkg: ExtendedPurchasedPackage) => void,
  handleSave: (pkg: ExtendedPurchasedPackage) => Promise<void>,
  updatePackageMutation: any,
  setEditingPackage: React.Dispatch<React.SetStateAction<string | null>>,
  setPackageToDelete: React.Dispatch<React.SetStateAction<string | null>>,
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<ExtendedPurchasedPackage>[] => [
  {
    accessorKey: "classPackage.name",
    header: "Paquete",
  },
  {
    accessorKey: "remainingClasses",
    header: "Clases Restantes",
    cell: ({ row }) => {
      const pkg = row.original
      return editingPackage === pkg.id ? (
        <Input
          type="number"
          value={editForm.remainingClasses}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              remainingClasses: parseInt(e.target.value),
            })
          }
          className="w-20 border-grey_pebble/20 bg-pearl"
          min="0"
          max={pkg.classPackage.classCount}
        />
      ) : (
        pkg.remainingClasses
      )
    },
  },
  {
    accessorKey: "expirationDate",
    header: "Fecha de Expiración",
    cell: ({ row }) => {
      const pkg = row.original
      return editingPackage === pkg.id ? (
        <Input
          type="date"
          value={editForm.expirationDate}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              expirationDate: e.target.value,
            })
          }
          min={new Date().toISOString().split("T")[0]}
          className="w-40 border-grey_pebble/20 bg-pearl"
        />
      ) : (
        formatDisplayDate(pkg.expirationDate)
      )
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const pkg = row.original
      return (
        <Badge className={`${getStatusBadgeColor(pkg.status)} text-pearl`}>
          {pkg.status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const pkg = row.original
      return editingPackage === pkg.id ? (
        <div className="flex justify-end space-x-2">
          <Button
            size="sm"
            onClick={() => handleSave(pkg)}
            disabled={updatePackageMutation.isPending}
            className="bg-rust text-pearl hover:bg-rust/90"
          >
            {updatePackageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Guardar"
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingPackage(null)}
            className="border-grey_pebble/20 text-grey_pebble hover:bg-grey_pebble/10"
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <div className="flex justify-end space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(pkg)}
            className="text-grey_pebble hover:bg-grey_pebble/10"
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setPackageToDelete(pkg.id)
              setIsDeleteModalOpen(true)
            }}
            className="text-rust hover:bg-rust/10"
          >
            Eliminar
          </Button>
        </div>
      )
    },
  },
]
