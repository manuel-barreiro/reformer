"use client"

import React, { useState } from "react"
import { ClassPackage } from "@prisma/client"
import { numberFormatter } from "@/lib/numberFormatter"
import { EditPen, TrashIcon } from "@/assets/icons"
import { LockIcon, LockOpen } from "lucide-react"
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
} from "@/actions/package-actions"
import { cn } from "@/lib/utils"

const isErrorResponse = (response: any): response is { error: string } => {
  return "error" in response
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
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState<"block" | "delete">("block")

  const handleEditSubmit = (updatedPackage: ClassPackage) => {
    setIsOpen(false)
    onPackageUpdate(updatedPackage)
  }

  const handleBlockPackage = async () => {
    const result = await togglePackageStatus(pack.id)
    if (isErrorResponse(result)) {
      console.error("Error updating package status:", result.error)
    } else if (result.package) {
      onPackageUpdate(result.package as ClassPackage)
    }
    setIsAlertOpen(false)
  }

  const handleDeletePackage = async () => {
    const result = await softDeletePackage(pack.id)
    if (isErrorResponse(result)) {
      console.error("Error deleting package:", result.error)
    } else if (result.package && result.isDeleted) {
      onPackageDelete(pack.id)
    }
    setIsAlertOpen(false)
  }

  return (
    <div
      className={cn(
        "flex h-full max-w-[300px] flex-col items-center justify-evenly bg-midnight text-pearl",
        !pack.isActive &&
          "border-grey_pebble/50 bg-midnight/50 text-grey_pebble/40"
      )}
    >
      <div
        className={cn(
          "w-full flex-1 border-[2px] border-b-0 border-grey_pebble p-6 text-center",
          !pack.isActive && "border-grey_pebble/50"
        )}
      >
        <span
          className={cn(
            "w-full font-dm_mono text-lg uppercase",
            !pack.isActive && "line-through"
          )}
        >
          {pack.name}
        </span>
      </div>
      <div
        className={cn(
          "flex w-full flex-1 flex-col border-[2px] border-b-0 border-grey_pebble p-6 py-8 text-center font-dm_sans text-sm font-light",
          !pack.isActive && "border-grey_pebble/50"
        )}
      >
        <span className="mb-2">Duración: {pack.durationMonths} mes</span>
        <span>10% OFF pagando en efectivo o transferencia bancaria</span>
      </div>
      <div className="flex w-full items-center justify-between bg-pearlVariant3 p-6 text-center text-midnight">
        <div
          className={cn(
            "font-dm_mono text-lg font-medium",
            !pack.isActive && "text-grey_pebble/40 line-through"
          )}
        >{`${numberFormatter.format(pack.price)}`}</div>
        <div className="flex items-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="group">
                <EditPen className="h-4 w-4 text-tableContent group-hover:text-midnight" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Paquete</DialogTitle>
              </DialogHeader>
              <EditPackageForm pack={pack} onSuccess={handleEditSubmit} />
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isAlertOpen && alertType === "block"}
            onOpenChange={(open) => {
              setIsAlertOpen(open)
              setAlertType("block")
            }}
          >
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="group">
                {pack.isActive ? (
                  <LockIcon className="h-4 w-4 text-tableContent group-hover:text-midnight" />
                ) : (
                  <LockOpen className="h-4 w-4 text-tableContent group-hover:text-midnight" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {pack.isActive ? "Bloquear Paquete" : "Desbloquear Paquete"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Estás seguro que quieres{" "}
                  {pack.isActive ? "bloquear" : "desbloquear"} este paquete?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
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

          <AlertDialog
            open={isAlertOpen && alertType === "delete"}
            onOpenChange={(open) => {
              setIsAlertOpen(open)
              setAlertType("delete")
            }}
          >
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="group">
                <TrashIcon className="h-4 w-4 text-tableContent group-hover:text-midnight" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar Paquete</AlertDialogTitle>
                <AlertDialogDescription>
                  Estás seguro que quieres eliminar este paquete? Esta acción no
                  se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePackage}
                  className="flex items-center gap-2"
                >
                  <TrashIcon className="h-4 w-4 text-pearl" />
                  <span>Eliminar</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
