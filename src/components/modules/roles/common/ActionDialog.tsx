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

export default function ActionDialog({
  trigger,
  content,
  title,
  description,
  action,
  buttonText,
  icon,
}: {
  trigger: JSX.Element
  content?: JSX.Element
  title: string
  description?: string
  action: () => void
  buttonText: string
  icon?: JSX.Element
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {content}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={action}
            className="flex items-center gap-2"
          >
            {icon}
            <span>{buttonText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    // <Dialog>
    //   <DialogTrigger asChild>{trigger}</DialogTrigger>
    //   <DialogContent className="max-w-xs rounded-xl bg-pearl text-midnight sm:max-w-[425px]">
    //     <DialogHeader>
    //       <DialogTitle className="font-dm_sans">¿Estás seguro?</DialogTitle>
    //       <DialogDescription>
    //         Esta acción no se puede revertir.
    //       </DialogDescription>
    //     </DialogHeader>
    //     <div className="flex flex-col items-center gap-1">
    //       <DialogClose className="w-full">
    //         <Button
    //           type="submit"
    //           className="w-full bg-rust py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust/90"
    //         >
    //           CANCELAR RESERVA
    //         </Button>
    //       </DialogClose>
    //       <DialogClose className="w-full">
    //         <Button
    //           type="submit"
    //           className="w-full bg-midnight py-6 font-dm_mono text-pearl duration-300 ease-in-out"
    //         >
    //           VOLVER
    //         </Button>
    //       </DialogClose>
    //     </div>
    //   </DialogContent>
    // </Dialog>
  )
}
