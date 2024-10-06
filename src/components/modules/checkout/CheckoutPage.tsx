"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import marmolBg from "/public/images/marmolBg.png"
import React, { useRef } from "react"
import Image from "next/image"
import { Separator } from "@radix-ui/react-separator"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { CreditCardIcon, CashIcon, BankTransferIcon } from "@/assets/icons"

export default function CheckoutPage() {
  //Parallax
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  //Framer motion animation
  const pilatesAnimationVariants = {
    initial: { y: 15, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  }

  const listAnimationRight = {
    initial: { x: -15, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  }

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
          <OrderSummary />
          <DiscountCoupon />
        </div>
        <FinalCheckout />
      </div>
    </section>
  )
}

function OrderSummary({}: {}) {
  return (
    <div className="flex h-auto w-full max-w-[450px] flex-col items-start justify-evenly gap-3 border-[2px] border-grey_pebble bg-midnight/60 px-5 py-6 md:px-10 md:py-12">
      <h3 className="font-dm_mono text-xl">PAQUETE X4 CLASES</h3>
      <RadioGroup
        defaultValue="yoga"
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
        <span className="font-bold">$ 48.000</span>
      </div>
      <Separator className="h-[1px] w-full rounded-full bg-pearl/70" />

      <div className="mt-5 flex flex-col gap-3 px-1 font-light">
        <p>
          Este paquete incluye 4 clases de pilates para utilizar en el período
          de un mes.
        </p>
        <p className="italic">
          Al finalizar el pedido podrás reservar las fechas para tus clases
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

function FinalCheckout() {
  return (
    <div className="flex h-auto w-full max-w-[450px] flex-col justify-between border-[2px] border-grey_pebble bg-midnight/60">
      <div className="flex flex-col items-start gap-3 px-5 py-6 md:px-10 md:py-12">
        <p className="font-dm_mono text-xl">Resumen de compra</p>
        <div className="w-full border-[1px] border-pearl/30 bg-midnight/70 p-3">
          <p className="text-center text-base md:text-xl">
            PACK X12 CLASES - PILATES
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
            <CreditCardIcon className="h-6 w-6" />
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
