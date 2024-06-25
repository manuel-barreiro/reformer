"use client"

import hero from "../../public/images/hero.webp"
import heroMobile from "../../public/images/heroMobile.webp"

import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section
      ref={sectionRef}
      className="relative h-[80vh] w-full overflow-hidden md:h-[90vh]"
    >
      <motion.div className="absolute h-[110%] w-full" style={{ top: y }}>
        <Image
          alt="Reformer Wellness Club"
          title="Reformer Yoga, Pilates, Massages"
          priority={true}
          className="inset-0 h-full w-full object-cover object-left md:hidden"
          src={heroMobile}
        />
        <Image
          alt="Reformer Wellness Club"
          title="Reformer Yoga, Pilates, Massages"
          priority={true}
          className="inset-0 hidden h-full w-full object-cover object-center md:block"
          src={hero}
        />
      </motion.div>

      <div className="relative flex h-full w-full items-center justify-center px-10 md:items-start md:justify-end md:pt-32 lg:px-20">
        <div className="flex flex-col items-center justify-start leading-loose md:items-end">
          <h1 className="mb-2 animate-fade-up font-marcellus text-3xl font-medium text-pearl animate-delay-[1000ms] animate-normal animate-duration-[3000ms] animate-once animate-ease-in-out sm:text-4xl md:text-5xl lg:mb-4 lg:animate-delay-[1500ms] xl:text-6xl">
            FUERZA. EQUILIBRIO.
          </h1>
          <h1 className="animate-fade-up font-marcellus text-3xl font-medium text-pearl animate-delay-[1000ms] animate-normal animate-duration-[3000ms] animate-once animate-ease-in-out sm:text-4xl md:text-5xl lg:text-right lg:animate-delay-[1500ms] xl:text-6xl">
            MOVILIDAD.
          </h1>
        </div>
      </div>
    </section>
  )
}
