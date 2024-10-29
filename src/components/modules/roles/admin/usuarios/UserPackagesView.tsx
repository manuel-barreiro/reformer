"use client"

import { useState, useTransition } from "react"
import { User, PurchasedPackage, ClassPackage } from "@prisma/client"
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
import { UpdatePackageInput } from "@/actions/users"
import Link from "next/link"
import { ChevronLeft, AlertTriangle } from "lucide-react"
import {
  assignPackage,
  updatePackage,
  deletePackage,
} from "@/actions/purchased-packages"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface UserPackagesViewProps {
  user: User & {
    purchasedPackages: (PurchasedPackage & {
      classPackage: ClassPackage
      payment: {
        total: number
        status: string
        dateCreated: Date
      } | null
    })[]
  }
  availablePackages: ClassPackage[]
}

export function UserPackagesView({
  user,
  availablePackages,
}: UserPackagesViewProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [editingPackage, setEditingPackage] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UpdatePackageInput>({
    remainingClasses: 0,
    expirationDate: "",
  })
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)
  const [newPackageForm, setNewPackageForm] = useState({
    classPackageId: "",
    expirationDate: "",
  })
  const { toast } = useToast()

  const handleEdit = (
    pkg: PurchasedPackage & { classPackage: ClassPackage }
  ) => {
    setEditingPackage(pkg.id)
    setEditForm({
      remainingClasses: pkg.remainingClasses,
      expirationDate: formatLocalDate(pkg.expirationDate),
    })
  }

  const validateEditForm = (
    pkg: PurchasedPackage & { classPackage: ClassPackage }
  ) => {
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

  const handleSave = async (
    pkg: PurchasedPackage & { classPackage: ClassPackage }
  ) => {
    if (!validateEditForm(pkg)) return

    startTransition(async () => {
      try {
        const result = await updatePackage(pkg.id, editForm)
        if (result.success) {
          toast({
            title: "Paquete actualizado con éxito",
            description: "Se ha actualizado el paquete correctamente.",
            variant: "reformer",
          })
          setEditingPackage(null)
          router.refresh()
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: `Error al actualizar el paquete: ${error}`,
          variant: "destructive",
        })
      }
    })
  }

  const handleDelete = async (packageId: string) => {
    startTransition(async () => {
      try {
        const result = await deletePackage(packageId)
        if (result.success) {
          toast({
            title: "Paquete eliminado con éxito",
            description: "Se ha eliminado el paquete y sus reservas asociadas.",
            variant: "reformer",
          })
          setIsDeleteModalOpen(false)
          setPackageToDelete(null)
          router.refresh()
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: `Error al eliminar el paquete: ${error}`,
          variant: "destructive",
        })
      }
    })
  }

  const handleAssignPackage = async () => {
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

    startTransition(async () => {
      try {
        const result = await assignPackage(user.id, newPackageForm)
        if (result.success) {
          toast({
            title: "Paquete asignado al usuario con éxito",
            description: "Se ha asignado el paquete correctamente.",
            variant: "reformer",
          })
          setIsAssignModalOpen(false)
          setNewPackageForm({ classPackageId: "", expirationDate: "" })
          router.refresh()
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: `Error al asignar el paquete: ${error}`,
          variant: "destructive",
        })
      }
    })
  }

  const formatDisplayDate = (date: Date) => {
    const localDate = utcToLocal(new Date(date))
    return format(localDate, "dd/MM/yyyy")
  }

  const getStatusBadgeColor = (status: string) => {
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

  if (user.purchasedPackages.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link
              href="/admin/usuarios"
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver a usuarios
            </Link>
            <h2 className="font-marcellus text-2xl font-bold">
              Paquetes de {user.name} {user.surname}
            </h2>
            <h3 className="font-dm_mono">[{user.email}]</h3>
          </div>
          <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rust text-pearl hover:bg-rust/90">
                Asignar nuevo paquete
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
                  className="w-full bg-rust text-pearl hover:bg-rust/90"
                >
                  Asignar paquete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-md border p-8 text-center">
          <p className="text-grey_pebble">
            No hay paquetes comprados para este usuario
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/usuarios"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver a usuarios
          </Link>
          <h2 className="font-marcellus text-2xl font-bold">
            Paquetes de {user.name} {user.surname}
          </h2>
          <h3 className="font-dm_mono">[{user.email}]</h3>
        </div>
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rust text-pearl hover:bg-rust/90">
              Asignar nuevo paquete
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
                className="w-full bg-rust text-pearl hover:bg-rust/90"
              >
                Asignar paquete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
            {user.purchasedPackages.map((pkg) => (
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
              onClick={() => packageToDelete && handleDelete(packageToDelete)}
              className="bg-rust text-pearl hover:bg-rust/90"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
