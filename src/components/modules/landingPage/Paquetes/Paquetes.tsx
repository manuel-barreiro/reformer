"use client"
import { useRef, useEffect, useState } from "react"
import marmolBg from "/public/images/marmolBg.png"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ClassPackage } from "@prisma/client"

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

  const [packages, setPackages] = useState([])

  useEffect(() => {
    const handlePackageUpdate = async () => {
      // Fetch the updated packages immediately after an update
      const response = await fetch("/api/user-packages")
      const data = await response.json()
      data.sort(
        (a: ClassPackage, b: ClassPackage) => a.classCount - b.classCount
      )
      setPackages(data)
    }
    handlePackageUpdate()
  }, [])

  return (
    <section
      id="paquetes"
      ref={sectionRef}
      className="relative flex h-auto min-h-[86dvh] w-full flex-col items-center justify-center gap-10 overflow-hidden bg-black/80 px-10 py-20 font-dm_mono text-pearl lg:px-20 lg:py-40"
    >
      <motion.div className="absolute -z-10 h-[110%] w-full" style={{ top: y }}>
        <Image
          alt="Fondo de marmol"
          title="Fondo de marmol"
          className="inset-0 h-full w-full object-cover object-center"
          src={marmolBg}
        />
      </motion.div>

      <h2 className="text-lg uppercase md:text-xl">Nuestros paquetes</h2>

      <div className="grid h-auto w-auto max-w-[1000px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-0">
        {packages?.map((pack: ClassPackage) => (
          <Paquete key={pack.id} name={pack.name} />
        ))}
      </div>
    </section>
  )
}

function Paquete({ name }: { name: string }) {
  return (
    <div className="flex h-full max-w-[300px] flex-col items-center justify-evenly bg-midnight/60">
      <div className="w-full flex-1 border-[2px] border-b-0 border-grey_pebble p-6 text-center">
        <span className="w-full text-lg font-thin">{name}</span>
      </div>
      <div className="flex w-full flex-1 flex-col border-[2px] border-b-0 border-grey_pebble p-6 py-8 text-center font-dm_sans text-sm font-light">
        <span className="mb-2">Duración: 1 mes</span>

        <span>10% OFF pagando en efectivo o transferencia bancaria</span>
      </div>
      <Link href="/checkout" className="w-full">
        <button className="w-full flex-1 border-[2px] border-grey_pebble p-6 font-dm_sans text-lg font-bold duration-300 ease-in-out hover:bg-pearlVariant2 hover:text-midnight">
          EMPEZÁ
        </button>
      </Link>
    </div>
  )
}
