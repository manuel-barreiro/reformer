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

export default function CheckoutPage({
  classPackages,
}: {
  classPackages: ClassPackage[]
}) {
  const { selectedPackage, setSelectedPackage, handleCheckout } =
    useCheckout(classPackages)

  // const { sectionRef, y } = useParallax()

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  return (
    <section
      // ref={sectionRef}
      className="relative flex h-auto min-h-[100dvh] w-full cursor-default flex-col items-center justify-start gap-10 overflow-hidden bg-black/80 px-10 py-10 font-dm_sans text-pearl lg:px-14 lg:py-14"
    >
      {/* <motion.div className="absolute -z-10 h-[110%] w-full" style={{ top: y }}>
        <Image
          alt="Fondo de marmol"
          title="Fondo de marmol"
          className="inset-0 h-full w-full object-cover object-center"
          src={marmolBg}
          priority
        />
      </motion.div> */}

      {/* <div className="absolute -z-10 h-[110%] w-full">
        <Image
          alt="Fondo de marmol"
          title="Fondo de marmol"
          className="inset-0 h-full w-full object-cover object-center"
          src={marmolBg}
          priority
        />
      </div> */}

      <div className="grid h-auto w-auto max-w-[900px] grid-cols-1 justify-items-stretch gap-6 md:grid-cols-2 md:gap-2">
        <div className="flex flex-grow flex-col gap-2">
          <OrderSummary
            classPackages={classPackages}
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
