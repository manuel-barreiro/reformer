"use client"
import { useRef } from "react"
import marmolBg from "/public/images/marmolBg.webp"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ClassPackage } from "@prisma/client"
import { cn } from "@/lib/utils"

export default function Paquetes({
  activeClassPackages,
}: {
  activeClassPackages: ClassPackage[]
}) {
  //Parallax
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section
      id="paquetes"
      ref={sectionRef}
      className="relative flex h-auto min-h-[86vh] w-full flex-col items-center justify-center gap-10 overflow-hidden bg-black/80 px-10 py-20 font-dm_mono text-pearl lg:px-20 lg:py-40"
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

      <div
        className={cn(
          "grid h-auto w-auto max-w-[1000px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-0",
          activeClassPackages.length === 1 && "md:grid-cols-1 lg:grid-cols-1",
          activeClassPackages.length === 2 && "md:grid-cols-2 lg:grid-cols-2",
          activeClassPackages.length === 3 && "md:grid-cols-3 lg:grid-cols-3",
          activeClassPackages.length === 4 && "md:grid-cols-4 lg:grid-cols-4",
          activeClassPackages.length === 5 &&
            "md:grid-cols-3 lg:grid-cols-3 lg:gap-3"
        )}
      >
        {activeClassPackages?.map((pack: ClassPackage) => (
          <Paquete key={pack.id} pack={pack} />
        ))}
      </div>
    </section>
  )
}

function Paquete({ pack }: { pack: ClassPackage }) {
  return (
    <div className="flex h-full max-w-[300px] flex-col items-center justify-evenly bg-midnight/60">
      <div className="w-full flex-1 border-[2px] border-b-0 border-grey_pebble p-6 text-center">
        <span className="w-full text-lg font-thin">{pack.name}</span>
      </div>
      <div className="flex h-20 w-full flex-1 flex-col items-center justify-center border-[2px] border-b-0 border-grey_pebble p-6 py-8 text-center font-dm_sans text-sm font-light">
        <span className="mb-2">
          Duración: {pack.durationMonths}{" "}
          {pack.durationMonths === 1 ? "mes" : "meses"}
        </span>

        <span>{pack.description}</span>
      </div>
      <Link href="/checkout" className="w-full">
        <button className="w-full flex-1 border-[2px] border-grey_pebble p-6 font-dm_sans text-lg font-bold duration-300 ease-in-out hover:bg-pearlVariant2 hover:text-midnight">
          EMPEZÁ
        </button>
      </Link>
    </div>
  )
}
