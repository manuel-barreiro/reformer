"use client"
import React from "react"
import { brand } from "../../../public"
import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

function BrandBottom() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-40%", "20%"])
  return (
    <div className="relative h-auto w-full overflow-hidden">
      <motion.div className="absolute h-[140%] w-full" style={{ top: y }}>
        <Image
          alt="Reformer Wellness Club"
          title="Reformer"
          priority={true}
          className="inset-0 h-full w-full object-cover object-left"
          src={brand}
        />
      </motion.div>
      <div className="justify-center-center relative flex h-full w-full">
        <div className="flex h-full flex-col items-start gap-8 p-14 sm:p-28 lg:ml-[20rem] xl:ml-[24rem]">
          <h2 className="font-marcellus text-4xl text-pearl sm:text-5xl md:text-5xl">
            WELLNESS CLUB
          </h2>
          <p className="font-dm_mono text-sm font-extralight text-pearl">
            / wel · nuhs / klǝb
          </p>
          <span className="font-dm_mono text-sm font-extralight text-pearl">
            noun
          </span>
          <p className="-mt-4 max-w-sm text-wrap font-dm_mono text-sm font-extralight text-pearl">
            1. Un espacio que integra la actividad física{" "}
            <br className="hidden sm:block" /> con el bienestar mental y
            emocional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BrandBottom
