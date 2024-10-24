"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, PurchasedPackage, PackageStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { UpdatePackageInput } from "@/actions/users"
import { formatLocalDate } from "@/lib/timezone-utils"

interface PackagesModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  packages: (PurchasedPackage & {
    classPackage: { name: string; classCount: number; durationMonths: number }
    payment: {
      total: number
      status: string
      dateCreated: Date
    } | null
  })[]
  onUpdatePackage: (
    packageId: string,
    data: UpdatePackageInput
  ) => Promise<void>
}

export function PackagesModal({
  isOpen,
  onClose,
  user,
  packages,
  onUpdatePackage,
}: PackagesModalProps) {
  const [editingPackage, setEditingPackage] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UpdatePackageInput>({
    remainingClasses: 0,
    expirationDate: "",
  })

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEditingPackage(null)
      setEditForm({
        remainingClasses: 0,
        expirationDate: "",
      })
    }
  }, [isOpen])

  const handleEdit = (pkg: PurchasedPackage) => {
    setEditingPackage(pkg.id)
    setEditForm({
      remainingClasses: pkg.remainingClasses,
      expirationDate: formatLocalDate(pkg.expirationDate),
    })
  }

  const handleSave = async (packageId: string) => {
    try {
      await onUpdatePackage(packageId, editForm)
      setEditingPackage(null)
    } catch (error) {
      console.error("Error updating package:", error)
    }
  }

  const getStatusBadgeColor = (status: PackageStatus) => {
    switch (status) {
      case "active":
        return "bg-emerald-500"
      case "expired":
        return "bg-rust"
      case "cancelled":
        return "bg-grey_pebble"
      default:
        return "bg-midnight"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden bg-pearlVariant">
        <DialogHeader>
          <DialogTitle className="font-marcellus text-xl text-grey_pebble">
            Paquetes de {user.name} {user.surname}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          {packages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-grey_pebble">
                  <TableHead className="text-grey_pebble">Paquete</TableHead>
                  <TableHead className="text-grey_pebble">
                    Clases Restantes
                  </TableHead>
                  <TableHead className="text-grey_pebble">
                    Fecha de Expiración
                  </TableHead>
                  <TableHead className="text-grey_pebble">Estado</TableHead>
                  <TableHead className="text-right text-grey_pebble">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-pearlVariant text-sm text-tableContent">
                {packages.map((pkg) => (
                  <TableRow
                    key={pkg.id}
                    className="border-b border-grey_pebble"
                  >
                    <TableCell className="font-medium">
                      {pkg.classPackage.name}
                    </TableCell>
                    <TableCell>
                      {editingPackage === pkg.id ? (
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
                        />
                      ) : (
                        pkg.remainingClasses
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPackage === pkg.id ? (
                        <Input
                          type="date"
                          value={editForm.expirationDate}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              expirationDate: e.target.value,
                            })
                          }
                          className="w-40 border-grey_pebble/20 bg-pearl"
                        />
                      ) : (
                        new Date(pkg.expirationDate).toLocaleDateString("es-ES")
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusBadgeColor(pkg.status)} text-pearl`}
                      >
                        {pkg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingPackage === pkg.id ? (
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(pkg.id)}
                            className="bg-rust text-pearl hover:bg-rust/90"
                          >
                            Guardar
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(pkg)}
                          className="text-grey_pebble hover:bg-grey_pebble/10"
                        >
                          Editar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex w-72 justify-center p-4 text-grey_pebble/80">
              <span className="mx-auto">No hay paquetes disponibles</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
