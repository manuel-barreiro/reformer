"use client"

import { useState } from "react"
import {
  User,
  PurchasedPackage,
  ClassPackage,
  PackageStatus,
} from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Loader2 } from "lucide-react"
import { formatLocalDate, utcToLocal } from "@/lib/timezone-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  useAssignPackage,
  useUpdatePackage,
  useDeletePackage,
} from "@/components/modules/roles/admin/usuarios/hooks/useUserQueries"
import { Skeleton } from "@/components/ui/skeleton"

interface ExtendedPurchasedPackage extends PurchasedPackage {
  classPackage: ClassPackage
  payment: {
    total: number
    status: string
    dateCreated: Date
  } | null
}

interface UserPackagesTabProps {
  userId: string
  packages: ExtendedPurchasedPackage[]
  availablePackages: ClassPackage[]
  isLoading: boolean
}

export function UserPackagesTab({
  userId,
  packages,
  availablePackages,
  isLoading,
}: UserPackagesTabProps) {
  const { toast } = useToast()

  // State for package editing
  const [editingPackage, setEditingPackage] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    remainingClasses: number
    expirationDate: string
  }>({
    remainingClasses: 0,
    expirationDate: "",
  })

  // State for modal visibility
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)

  // State for new package form
  const [newPackageForm, setNewPackageForm] = useState({
    classPackageId: "",
    expirationDate: "",
  })

  // Mutations with Tanstack Query
  const assignPackageMutation = useAssignPackage()
  const updatePackageMutation = useUpdatePackage()
  const deletePackageMutation = useDeletePackage()

  // Handler for editing a package
  const handleEdit = (pkg: ExtendedPurchasedPackage) => {
    setEditingPackage(pkg.id)
    setEditForm({
      remainingClasses: pkg.remainingClasses,
      expirationDate: formatLocalDate(pkg.expirationDate),
    })
  }

  // Validate the edit form
  const validateEditForm = (pkg: ExtendedPurchasedPackage) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(editForm.expirationDate)

    if (selectedDate < today) {
      toast({
        title: "Error de validación",
        description: "La fecha de expiración no puede ser anterior a hoy",
        variant: "destructive",
      })
      return false
    }

    if (editForm.remainingClasses > pkg.classPackage.classCount) {
      toast({
        title: "Error de validación",
        description: `Las clases restantes no pueden exceder el total del paquete (${pkg.classPackage.classCount} clases)`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // Handler for saving package edits
  const handleSave = async (pkg: ExtendedPurchasedPackage) => {
    if (!validateEditForm(pkg)) return

    updatePackageMutation.mutate(
      {
        packageId: pkg.id,
        userId: userId,
        updateData: editForm,
      },
      {
        onSuccess: () => {
          setEditingPackage(null)
        },
      }
    )
  }

  // Handler for deleting packages
  const handleDelete = async () => {
    if (!packageToDelete) return

    deletePackageMutation.mutate(
      {
        packageId: packageToDelete,
        userId: userId,
      },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setPackageToDelete(null)
        },
      }
    )
  }

  // Handler for assigning new packages
  const handleAssignPackage = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(newPackageForm.expirationDate)

    if (selectedDate < today) {
      toast({
        title: "Error de validación",
        description: "La fecha de expiración no puede ser anterior a hoy",
        variant: "destructive",
      })
      return
    }

    assignPackageMutation.mutate(
      {
        userId: userId,
        packageData: newPackageForm,
      },
      {
        onSuccess: () => {
          setIsAssignModalOpen(false)
          setNewPackageForm({ classPackageId: "", expirationDate: "" })
        },
      }
    )
  }

  // Helper functions for formatting
  const formatDisplayDate = (date: Date) => {
    const localDate = utcToLocal(new Date(date))
    return format(localDate, "dd/MM/yyyy")
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Paquetes</h3>
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-rust text-pearl hover:bg-rust/90"
              disabled={assignPackageMutation.isPending}
            >
              {assignPackageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                "+ Asignar nuevo paquete"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-pearl">
            <DialogHeader>
              <DialogTitle className="font-marcellus text-xl text-grey_pebble">
                Asignar nuevo paquete
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-grey_pebble">
                  Seleccionar paquete
                </label>
                <Select
                  value={newPackageForm.classPackageId}
                  onValueChange={(value) =>
                    setNewPackageForm({
                      ...newPackageForm,
                      classPackageId: value,
                    })
                  }
                >
                  <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                    <SelectValue placeholder="Seleccionar paquete" />
                  </SelectTrigger>
                  <SelectContent className="bg-grey_pebble text-pearl">
                    {availablePackages.map((pkg) => (
                      <SelectItem
                        className="border-b border-pearl/50 capitalize hover:!bg-pearlVariant3"
                        key={pkg.id}
                        value={pkg.id}
                      >
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-grey_pebble">
                  Fecha de expiración
                </label>
                <Input
                  type="date"
                  value={newPackageForm.expirationDate}
                  onChange={(e) =>
                    setNewPackageForm({
                      ...newPackageForm,
                      expirationDate: e.target.value,
                    })
                  }
                  className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
                />
              </div>
              <Button
                onClick={handleAssignPackage}
                disabled={assignPackageMutation.isPending}
                className="w-full bg-rust text-pearl hover:bg-rust/90"
              >
                {assignPackageMutation.isPending
                  ? "Asignando..."
                  : "Asignar paquete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-grey_pebble">
            No hay paquetes registrados para este usuario
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
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
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="border-b border-grey_pebble">
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
                        min="0"
                        max={pkg.classPackage.classCount}
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
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="w-40 border-grey_pebble/20 bg-pearl"
                      />
                    ) : (
                      formatDisplayDate(pkg.expirationDate)
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-pearl">
          <DialogHeader>
            <DialogTitle className="font-marcellus text-xl text-grey_pebble">
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription className="text-grey_pebble">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-rust" />
                <span>
                  ¿Estás seguro que deseas eliminar este paquete? Esta acción
                  eliminará todas las reservas asociadas y no se puede deshacer.
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-grey_pebble/20 text-grey_pebble hover:bg-grey_pebble/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deletePackageMutation.isPending}
              className="bg-rust text-pearl hover:bg-rust/90"
            >
              {deletePackageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
