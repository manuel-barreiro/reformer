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
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ActionDialog({
  trigger,
  content,
  title,
  description,
  action,
  buttonText,
  icon,
  buttons,
  className,
  closeOnTop,
}: {
  trigger: JSX.Element
  content?: JSX.Element
  title: string
  description?: string | JSX.Element
  action: () => void
  buttonText: string
  icon?: JSX.Element
  buttons: boolean
  className?: string
  closeOnTop?: boolean
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {closeOnTop && (
              <AlertDialogCancel
                asChild
                className="!hover:bg-transparent !bg-transparent"
              >
                <button className="!hover:bg-transparent max-w-12 !bg-transparent text-xl font-bold">
                  <X className="h-4 w-4 text-midnight" />
                </button>
              </AlertDialogCancel>
            )}
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {content}
        {buttons && (
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
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
