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

export default function CheckoutPage() {
  const {
    selectedPackage,
    setSelectedPackage,
    selectedClass,
    setSelectedClass,
    handleCheckout,
    packageOptions,
  } = useCheckout()

  const { sectionRef, y } = useParallax()

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

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
          priority
        />
      </motion.div>

      <div className="grid h-auto w-auto max-w-[900px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-2">
        <div className="flex flex-col gap-2">
          <OrderSummary
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            packageOptions={packageOptions}
          />
          <DiscountCoupon />
        </div>
        <FinalCheckout
          selectedPackage={selectedPackage}
          selectedClass={selectedClass}
          onCheckout={handleCheckout}
        />
      </div>
    </section>
  )
}
