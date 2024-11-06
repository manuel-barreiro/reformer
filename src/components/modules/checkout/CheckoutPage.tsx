"use client"
import { motion } from "framer-motion"
import marmolBg from "/public/images/marmolBg.png"
import React, { useEffect } from "react"
import Image from "next/image"
import DiscountCoupon from "./components/DiscountCoupon"
import FinalCheckout from "./components/FinalCheckout"
import OrderSummary from "./components/OrderSummary"
import { useCheckout } from "./hooks/useCheckout"
import { useParallax } from "@/lib/useParallax"
import { ClassPackage } from "@prisma/client"
import { useMemo } from "react"

export default function CheckoutPage({
  classPackages,
}: {
  classPackages: ClassPackage[]
}) {
  // Memoize packages to prevent unnecessary re-renders
  const memoizedPackages = useMemo(() => classPackages, [classPackages])

  const { selectedPackage, setSelectedPackage, handleCheckout } =
    useCheckout(memoizedPackages)

  const { sectionRef, y } = useParallax()

  return (
    <section
      ref={sectionRef}
      className="relative flex h-auto min-h-[100dvh] w-full cursor-default flex-col items-center justify-start gap-10 overflow-hidden bg-black/80 px-10 py-10 font-dm_sans text-pearl lg:px-14 lg:py-14"
    >
      <motion.div
        className="absolute -z-10 h-[110%] w-full"
        style={{ top: y }}
        initial={false}
      >
        <Image
          alt="Fondo de marmol"
          title="Fondo de marmol"
          className="inset-0 h-full w-full object-cover object-center"
          src={marmolBg}
          priority
          sizes="100vw"
          loading="eager"
        />
      </motion.div>

      <div className="grid h-auto w-auto max-w-[900px] grid-cols-1 justify-items-stretch gap-6 md:grid-cols-2 md:gap-2">
        <div className="flex flex-grow flex-col gap-2">
          <OrderSummary
            classPackages={memoizedPackages}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
          <DiscountCoupon />
        </div>
        <FinalCheckout
          selectedPackage={selectedPackage}
          onCheckout={handleCheckout}
        />
      </div>
    </section>
  )
}
