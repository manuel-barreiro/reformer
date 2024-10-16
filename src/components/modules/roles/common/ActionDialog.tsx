import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ActionDialog({ trigger }: { trigger: JSX.Element }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xs rounded-xl bg-pearl text-midnight sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-dm_sans">¿Estás seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede revertir.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-1">
          <DialogClose className="w-full">
            <Button
              type="submit"
              className="w-full bg-rust py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust/90"
            >
              CANCELAR RESERVA
            </Button>
          </DialogClose>
          <DialogClose className="w-full">
            <Button
              type="submit"
              className="w-full bg-midnight py-6 font-dm_mono text-pearl duration-300 ease-in-out"
            >
              VOLVER
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
