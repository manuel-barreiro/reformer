import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

export default function OrderSummary({
  selectedPackage,
  setSelectedPackage,
  selectedClass,
  setSelectedClass,
  packageOptions,
}: {
  selectedPackage: {
    id: string
    name: string
    classQuantity: number
    price: number
  }
  setSelectedPackage: (pkg: {
    id: string
    name: string
    classQuantity: number
    price: number
  }) => void
  selectedClass: string
  setSelectedClass: (cls: string) => void
  packageOptions: {
    id: string
    name: string
    classQuantity: number
    price: number
  }[]
}) {
  return (
    <div className="flex h-auto w-full max-w-[450px] flex-col items-start justify-evenly gap-3 border-[2px] border-grey_pebble bg-midnight/60 px-5 py-6 md:px-10 md:py-12">
      <Select
        onValueChange={(value) =>
          setSelectedPackage(
            packageOptions.find((pkg) => pkg.name === value) ||
              packageOptions[0]
          )
        }
      >
        <SelectTrigger className="w-full bg-transparent">
          <SelectValue placeholder={selectedPackage.name} />
        </SelectTrigger>
        <SelectContent className="bg-pearlVariant2">
          {packageOptions.map((option) => (
            <SelectItem
              key={option.name}
              value={option.name}
              className="border-b-[1px] border-midnight"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <RadioGroup
        value={selectedClass}
        onValueChange={setSelectedClass}
        className="flex items-center gap-4 text-pearl"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pilates" id="r1" />
          <Label className="text-base font-extralight" htmlFor="r1">
            Pilates
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yoga" id="r2" />
          <Label className="text-base font-extralight" htmlFor="r2">
            Yoga
          </Label>
        </div>
      </RadioGroup>
      <div className="mt-5 flex w-full items-center justify-between px-1">
        <span className="font-extralight">Total</span>
        <span className="font-bold">
          {numberFormatter.format(selectedPackage.price)}
        </span>
      </div>
      <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />

      <div className="mt-5 flex flex-col gap-3 px-1 font-light">
        <p>
          Este paquete incluye{" "}
          <span className="font-semibold">
            {selectedPackage.classQuantity}{" "}
            {selectedPackage.classQuantity > 1 ? "clases" : "clase"} de{" "}
            {selectedClass}
          </span>{" "}
          para utilizar en el período de{" "}
          <span className="font-semibold">un mes</span>.
        </p>
        <p className="italic">
          Luego de que tu compra sea aprobada, podrás reservar tus clases en
          nuestro sistema.
        </p>
      </div>
    </div>
  )
}
