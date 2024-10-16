import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import React from "react"
import { numberFormatter } from "@/lib/numberFormatter"
import { ClassPackage } from "@prisma/client"

interface OrderSummaryProps {
  classPackages: ClassPackage[]
  selectedPackage: ClassPackage
  setSelectedPackage: (pkg: ClassPackage) => void
}

export default function OrderSummary({
  classPackages,
  selectedPackage,
  setSelectedPackage,
}: OrderSummaryProps) {
  return (
    <div className="flex h-auto w-full max-w-[450px] flex-col items-start justify-evenly gap-3 border-[2px] border-grey_pebble bg-midnight/60 px-5 py-6 md:px-10 md:py-12">
      <Select
        onValueChange={(value) =>
          setSelectedPackage(
            classPackages.find((pkg) => pkg.name === value) || classPackages[0]
          )
        }
      >
        <SelectTrigger className="w-full bg-transparent">
          <SelectValue placeholder={`PAQUETE ${selectedPackage.name}`} />
        </SelectTrigger>
        <SelectContent className="bg-pearlVariant2">
          {classPackages.map((option) => (
            <SelectItem
              key={option.name}
              value={option.name}
              className="border-b-[1px] border-midnight focus:bg-grey_pebble focus:text-pearl"
            >
              {`PAQUETE ${option.name}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-5 flex w-full items-center justify-between px-1 text-lg">
        <span className="font-extralight">Total</span>
        <span className="font-bold">
          {numberFormatter.format(selectedPackage.price)}
        </span>
      </div>
      <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />

      <div className="mt-5 flex flex-col gap-3 px-1 font-light">
        <p className="text-justify">
          Este paquete incluye{" "}
          <span className="font-semibold">
            {selectedPackage.classCount}{" "}
            {selectedPackage.classCount > 1 ? "clases" : "clase"}
          </span>{" "}
          {selectedPackage.classCount > 1 ? "combinables" : ""} de pilates
          {selectedPackage.classCount > 1 ? " y/o" : " o"} yoga{" "}
          {selectedPackage.classCount > 1
            ? "para que las puedas utilizar"
            : "para que la puedas utilizar"}{" "}
          en el período de <span className="font-semibold">un mes</span>.
        </p>
        <p className="italic">
          Luego de que tu compra sea aprobada, podrás reservar tus clases en
          nuestro sistema.
        </p>
      </div>
    </div>
  )
}
