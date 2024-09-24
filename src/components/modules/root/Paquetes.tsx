"use client"
import { useRef } from "react"
import marmolBg from "/public/images/marmolBg.png"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Paquetes() {
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
      className="relative flex h-auto w-full flex-col items-center justify-center gap-10 overflow-hidden bg-black/80 px-10 py-20 font-dm_mono text-pearl lg:px-20 lg:py-40"
    >
      <motion.div className="absolute -z-10 h-[110%] w-full" style={{ top: y }}>
        <Image
          alt="Fondo de marmol"
          title="Fondo de marmol"
          className="inset-0 h-full w-full object-cover object-center"
          src={marmolBg}
        />
      </motion.div>

      <h2 className="text-lg uppercase">Nuestros paquetes</h2>

      <div className="grid h-auto w-auto max-w-[900px] grid-cols-1 gap-6 md:grid-cols-3 md:gap-0">
        <Paquete clases="4" duracion="1" precio="48.000" />
        <Paquete clases="8" duracion="1" precio="80.000" />
        <Paquete clases="12" duracion="1" precio="108.000" />
      </div>
    </section>
  )
}

function Paquete({
  clases,
  duracion,
  precio,
}: {
  clases: string
  duracion: string
  precio: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-evenly bg-midnight/60">
      <div className="w-full flex-1 border-[2px] border-b-0 border-grey_pebble p-6 text-center">
        <span className="w-full text-lg font-thin">X{clases} CLASES</span>
      </div>
      <div className="flex w-full flex-1 flex-col border-[2px] border-b-0 border-grey_pebble p-4 text-center font-dm_sans text-sm font-light">
        <span className="mb-2">Duración: {duracion} mes</span>
        <span>10% OFF pagando en efectivo o transferencia bancaria</span>
        <span className="mt-4 text-base font-bold">${precio}</span>
      </div>
      <button className="w-full flex-1 border-[2px] border-grey_pebble p-6 font-dm_sans text-lg font-bold duration-300 ease-in-out hover:bg-pearl hover:text-midnight">
        EMPEZÁ
      </button>
    </div>
  )
}
