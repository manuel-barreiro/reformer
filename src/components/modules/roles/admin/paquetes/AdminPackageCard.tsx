"use client"

import React, { useState } from "react"
import { ClassPackage } from "@prisma/client"
import { numberFormatter } from "@/lib/numberFormatter"
import { EditPen, TrashIcon } from "@/assets/icons"
import { LockIcon, LockOpen, EyeIcon, EyeOffIcon } from "lucide-react" // Import Eye icons
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditPackageForm } from "./components/EditPackageForm"
import { Button } from "@/components/ui/button"
import {
  softDeletePackage,
  togglePackageStatus,
  togglePackageVisibility, // Import the new action
  PackageResponse,
  SoftDeleteResponse,
} from "@/actions/package-actions"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast" // Import useToast
import { Badge } from "@/components/ui/badge" // Import Badge
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const isErrorResponse = (
  response: PackageResponse
): response is { success: false; error: string | Record<string, string[]> } => {
  return !response.success
}

const isSoftDeleteError = (
  response: SoftDeleteResponse
): response is { success: false; error: string } => {
  return !response.success
}

interface AdminPackageCardProps {
  pack: ClassPackage
  onPackageUpdate: (updatedPackage: ClassPackage) => void
  onPackageDelete: (packageId: string) => void
}

export default function AdminPackageCard({
  pack,
  onPackageUpdate,
  onPackageDelete,
}: AdminPackageCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState<
    "block" | "delete" | "visibility" | null
  >(null)
  const { toast } = useToast()

  // ... handlers handleEditSubmit, handleBlockPackage, handleToggleVisibility, handleDeletePackage, openAlertDialog ...
  const handleEditSubmit = (updatedPackage: ClassPackage) => {
    setIsEditOpen(false) // Close edit dialog
    onPackageUpdate(updatedPackage)
    toast({ title: "Paquete actualizado", variant: "reformer" })
  }

  const handleBlockPackage = async () => {
    const result = await togglePackageStatus(pack.id)
    if (!isErrorResponse(result)) {
      onPackageUpdate(result.package)
      toast({
        title: `Paquete ${result.package.isActive ? "desbloqueado" : "bloqueado"}`,
        variant: "reformer",
      })
    } else {
      console.error("Error updating package status:", result.error)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del paquete.",
        variant: "destructive",
      })
    }
    setIsAlertOpen(false)
    setAlertType(null)
  }

  const handleToggleVisibility = async () => {
    const result = await togglePackageVisibility(pack.id)
    if (!isErrorResponse(result)) {
      onPackageUpdate(result.package)
      toast({
        title: `Visibilidad ${result.package.isVisible ? "activada" : "desactivada"}`,
        variant: "reformer",
      })
    } else {
      console.error("Error updating package visibility:", result.error)
      toast({
        title: "Error",
        description: "No se pudo cambiar la visibilidad del paquete.",
        variant: "destructive",
      })
    }
    setIsAlertOpen(false)
    setAlertType(null)
  }

  const handleDeletePackage = async () => {
    const result = await softDeletePackage(pack.id)
    if (!isSoftDeleteError(result)) {
      onPackageDelete(result.package.id)
      toast({ title: "Paquete eliminado", variant: "reformer" })
    } else {
      console.error("Error deleting package:", result.error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el paquete.",
        variant: "destructive",
      })
    }
    setIsAlertOpen(false)
    setAlertType(null)
  }

  const openAlertDialog = (type: "block" | "delete" | "visibility") => {
    setAlertType(type)
    setIsAlertOpen(true)
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          "relative flex h-full w-full max-w-[300px] flex-col overflow-hidden rounded-lg border-2 border-grey_pebble bg-midnight text-pearl shadow-md"
          // Removed opacity class
        )}
      >
        {/* Badges Container */}
        <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-1">
          {/* Inactive Badge - Render ONLY if inactive */}
          {!pack.isActive && (
            <Badge
              variant="destructive" // Use destructive variant for blocked
              className="flex items-center gap-1 bg-rust/90 text-pearl" // Custom styling
            >
              <LockIcon className="h-3 w-3" />
              Bloqueado
            </Badge>
          )}
          {/* Visibility Badge - Render if not visible */}
          {!pack.isVisible && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-grey_pebble/80 text-pearl hover:text-midnight/80"
            >
              <EyeOffIcon className="h-3 w-3" />
              Oculto
            </Badge>
          )}
        </div>

        {/* Card Header */}
        <div className="border-b-2 border-grey_pebble p-4 text-center">
          <span
            className={cn(
              "block truncate font-dm_mono text-lg uppercase",
              !pack.isActive && "text-grey_pebble/60 line-through" // Dim text if inactive
            )}
          >
            {pack.name}
          </span>
        </div>

        {/* Card Middle Section */}
        <div className="flex flex-grow flex-col border-b-2 border-grey_pebble p-4 text-center font-dm_sans text-sm font-light">
          <div
            className={cn(
              "mb-2",
              !pack.isActive && "text-grey_pebble/60" // Dim text if inactive
            )}
          >
            <span className="font-semibold">{pack.classCount}</span>{" "}
            {pack.classCount === 1 ? "Clase" : "Clases"} /{" "}
            <span className="font-semibold">{pack.durationMonths}</span>{" "}
            {pack.durationMonths === 1 ? "Mes" : "Meses"}
          </div>
          <p
            className={cn(
              "flex-grow text-xs text-pearl/80",
              !pack.isActive && "text-grey_pebble/50" // Dim description more if inactive
            )}
          >
            {pack.description || "Sin descripción"}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between bg-pearlVariant3 p-3 text-midnight">
          <div
            className={cn(
              "font-dm_mono text-lg font-medium",
              !pack.isActive && "text-grey_pebble/60 line-through" // Dim price if inactive
            )}
          >
            {numberFormatter.format(pack.price)}
          </div>
          {/* Action buttons */}
          <div className="z-20 flex items-center space-x-1">
            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="group h-7 w-7"
                      disabled={!pack.isActive}
                    >
                      <EditPen className="h-4 w-4 text-tableContent group-hover:text-midnight" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-midnight text-pearl">
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Paquete</DialogTitle>
                </DialogHeader>
                <EditPackageForm pack={pack} onSuccess={handleEditSubmit} />
              </DialogContent>
            </Dialog>
            {/* Visibility Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group h-7 w-7"
                  onClick={() => openAlertDialog("visibility")}
                  disabled={!pack.isActive}
                >
                  {pack.isVisible ? (
                    <EyeIcon className="h-4 w-4 text-tableContent group-hover:text-midnight" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4 text-tableContent group-hover:text-midnight" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-midnight text-pearl">
                <p>{pack.isVisible ? "Ocultar" : "Mostrar"}</p>
              </TooltipContent>
            </Tooltip>
            {/* Block/Unblock Alert Dialog */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group h-7 w-7"
                  onClick={() => openAlertDialog("block")}
                  // No disabled prop here
                >
                  {pack.isActive ? (
                    <LockIcon className="h-4 w-4 text-tableContent group-hover:text-midnight" />
                  ) : (
                    <LockOpen className="h-4 w-4 text-tableContent group-hover:text-midnight" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-midnight text-pearl">
                <p>{pack.isActive ? "Bloquear" : "Desbloquear"}</p>
              </TooltipContent>
            </Tooltip>
            {/* Delete Alert Dialog */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group h-7 w-7 text-rust hover:bg-rust/10"
                  onClick={() => openAlertDialog("delete")}
                  disabled={!pack.isActive}
                >
                  <TrashIcon className="h-4 w-4 group-hover:text-rust" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-midnight text-pearl">
                <p>Eliminar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* --- Alert Dialogs --- */}
        {/* Visibility Alert */}
        <AlertDialog
          open={isAlertOpen && alertType === "visibility"}
          onOpenChange={(open) => !open && setAlertType(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {pack.isVisible ? "Ocultar Paquete" : "Mostrar Paquete"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Estás seguro que quieres{" "}
                {pack.isVisible ? "ocultar" : "mostrar"} este paquete para los
                usuarios?
                {pack.isVisible
                  ? " No aparecerá en la landing ni checkout."
                  : " Aparecerá en la landing y checkout."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleVisibility}
                className="flex items-center gap-2"
              >
                {pack.isVisible ? (
                  <EyeOffIcon className="h-4 w-4 text-pearl" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-pearl" />
                )}
                <span>{pack.isVisible ? "Ocultar" : "Mostrar"}</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Block/Unblock Alert */}
        <AlertDialog
          open={isAlertOpen && alertType === "block"}
          onOpenChange={(open) => !open && setAlertType(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {pack.isActive ? "Bloquear Paquete" : "Desbloquear Paquete"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Estás seguro que quieres{" "}
                {pack.isActive ? "bloquear" : "desbloquear"} este paquete?
                {pack.isActive
                  ? " Los usuarios no podrán comprarlo."
                  : " Los usuarios podrán comprarlo."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBlockPackage}
                className="flex items-center gap-2"
              >
                {pack.isActive ? (
                  <LockIcon className="h-4 w-4 text-pearl" />
                ) : (
                  <LockOpen className="h-4 w-4 text-pearl" />
                )}
                <span>{pack.isActive ? "Bloquear" : "Desbloquear"}</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Alert */}
        <AlertDialog
          open={isAlertOpen && alertType === "delete"}
          onOpenChange={(open) => !open && setAlertType(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar Paquete</AlertDialogTitle>
              <AlertDialogDescription>
                Estás seguro que quieres eliminar este paquete? Esta acción no
                se puede deshacer y lo marcará como inactivo y eliminado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePackage}
                className="flex items-center gap-2 bg-rust text-pearl hover:bg-rust/90"
              >
                <TrashIcon className="h-4 w-4 text-pearl" />
                <span>Eliminar</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
