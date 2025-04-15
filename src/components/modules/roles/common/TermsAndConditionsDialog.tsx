import * as React from "react"
import { useMediaQuery } from "@/components/ui/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Content from terms_and_conditions.txt
const termsContent = `
Cancelaciones y Devoluciones:
REFORMER cuenta con una política de cancelación de clases reservadas y pagadas de 12 horas previas a la clase, sin ningún cargo o penalidad para el usuario. Los créditos de las clases canceladas serán liberados y se podrán volver a usar para reservar posteriormente.
Se requiere un aviso minimo de 12hs para poder cancelar tu reserva. De lo contrario, el crédito se pierde. No existirán excepciones.
No-show: la clase se cobra igual.

Tolerancia:
La tolerancia para para ingresar a cada clase es de 10 minutos, ya que es imperativo que los usuarios puedan realizar la mayoría de la clase para evitar lesiones o cualquier percance.

Descargo de Responsabilidad:
REFORMER aconseja visitar a su médico antes de iniciarse en cualquier tipo de programa de acondicionamiento físico, la no revisión previa de su estado de salud queda a responsabilidad del propio suscriptor dejando exento a REFORMER de los posibles prejuicios que pueda ocasionar en el suscriptor.
REFORMER no se hace responsable por lesiones, daños o pérdidas que puedan ocurrir como resultado de la participación en las clases.

Generales:
REFORMER se reserva el derecho a modificar total o parcialmente estos Términos y Condiciones en cualquier momento. En cuyo caso los Términos y Condiciones actualizados se publicarán en el Sitio Web, siendo obligación de los Usuarios revisar regularmente esta sección a fin de informarse de cualquier cambio que se pueda haber producido.

¡Gracias por elegirnos!
`

// Helper to format the text with paragraphs
const FormattedTerms = () => (
  <div className="max-h-[60vh] space-y-4 overflow-y-auto px-4 text-sm text-slate-700 dark:text-slate-400 sm:px-0">
    {termsContent
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => {
        // Simple check for potential headings (all caps or ending with ':')
        const isHeading =
          line === line.toUpperCase() || line.trim().endsWith(":")
        return (
          <p key={index} className={isHeading ? "mt-2 font-semibold" : ""}>
            {line}
          </p>
        )
      })}
  </div>
)

export function TermsAndConditionsDialog({
  children, // The trigger element
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const title = "Términos y Condiciones"
  const description = "Por favor, lee nuestros términos y condiciones."

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="bg-pearl text-midnight sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-marcellus text-xl">
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FormattedTerms />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-pearl text-midnight">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-marcellus text-xl">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <FormattedTerms />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
