"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import marmolBg from "/public/images/marmolBg.png"
import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Separator } from "@radix-ui/react-separator"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { CreditCardIcon, CashIcon, BankTransferIcon } from "@/assets/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define the package options
const packageOptions = [
  { name: "PAQUETE X4 CLASES", classQuantity: 4, price: 56000 },
  { name: "PAQUETE X8 CLASES", classQuantity: 8, price: 96000 },
  { name: "PAQUETE X12 CLASES", classQuantity: 12, price: 120000 },
  { name: "CLASE INDIVIDUAL", classQuantity: 1, price: 15000 },
]

// Create a number formatter
const numberFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function CheckoutPage() {
  const [selectedPackage, setSelectedPackage] = useState(packageOptions[0])
  const [selectedClass, setSelectedClass] = useState("pilates")

  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  //Parallax
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-auto min-h-[100dvh] w-full cursor-default flex-col items-center justify-start gap-10 overflow-hidden bg-black/80 px-10 py-10 font-dm_sans text-pearl lg:px-14 lg:py-14"
    >
      <motion.div className="absolute -z-10 h-[110%] w-full" style={{ top: y }}>
        <Image
          alt="Fondo de marmol"
          title="Fondo de marmol"
          className="inset-0 h-full w-full object-cover object-center"
          src={marmolBg}
        />
      </motion.div>

      <div className="grid h-auto w-auto max-w-[900px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-2">
        <div className="flex flex-col gap-2">
          <OrderSummary
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
          <DiscountCoupon />
        </div>
        <FinalCheckout
          selectedPackage={selectedPackage}
          selectedClass={selectedClass}
        />
      </div>
    </section>
  )
}

function OrderSummary({
  selectedPackage,
  setSelectedPackage,
  selectedClass,
  setSelectedClass,
}: {
  selectedPackage: { name: string; classQuantity: number; price: number }
  setSelectedPackage: (pkg: {
    name: string
    classQuantity: number
    price: number
  }) => void
  selectedClass: string
  setSelectedClass: (cls: string) => void
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

function DiscountCoupon() {
  return (
    <div className="flex h-auto w-full max-w-[450px] flex-col items-start justify-evenly gap-3 border-[2px] border-grey_pebble bg-midnight/60 px-5 py-6 md:px-10">
      <p className="font-dm_mono">¿Tenés un cupón de descuento?</p>
      <div className="relative h-auto w-full">
        <Input
          type="text"
          className="focus:shadow-outline h-full w-full rounded-none border-0 border-b-[2px] border-pearl/70 bg-transparent ring-0 focus:border-midnight/60 focus:ring-0 focus:ring-midnight/60 focus:ring-offset-0"
        />
        <ChevronRight className="absolute right-0 top-1 h-7 w-7 text-pearl/70" />
      </div>
    </div>
  )
}

function FinalCheckout({
  selectedPackage,
  selectedClass,
}: {
  selectedPackage: { name: string; price: number }
  selectedClass: string
}) {
  return (
    <div className="flex h-auto w-full max-w-[450px] flex-col justify-between border-[2px] border-grey_pebble bg-midnight/60">
      <div className="flex flex-col items-start gap-3 px-5 py-6 md:px-10 md:py-12">
        <p className="font-dm_mono text-xl">Resumen de compra</p>
        <div className="w-full border-[1px] border-pearl/30 bg-midnight/70 p-3">
          <p className="text-center text-base md:text-xl">
            {selectedPackage.name} - {selectedClass.toUpperCase()}
          </p>
        </div>
        <div className="mt-5 flex w-full flex-col gap-3">
          <p className="font-semibold">MEDIOS DE PAGO</p>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-6 w-6" />
            <span>Tarjeta de crédito</span>
          </div>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
          <div className="flex items-center gap-2">
            <CashIcon className="h-6 w-6" />
            <span>Efectivo</span>
          </div>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
          <div className="flex items-center gap-2">
            <BankTransferIcon className="h-6 w-6" />
            <span>Transferencia Bancaria</span>
          </div>
          <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />
        </div>
      </div>

      <button className="w-full flex-1 border-t-[2px] border-grey_pebble p-6 font-dm_sans text-lg font-bold duration-300 ease-in-out hover:bg-pearlVariant2 hover:text-midnight">
        <Link href="/checkout" className="h-full w-full">
          REALIZAR PAGO
        </Link>
      </button>
    </div>
  )
}
