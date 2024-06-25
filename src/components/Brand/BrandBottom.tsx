"use client"
import React, { useEffect } from "react"
import { brand } from "../../../public"
import Image from "next/image"
import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Typewriter from "typewriter-effect"

function BrandBottom() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  useEffect(() => {
    console.log("Element is in view: ", isInView)
  }, [isInView])
  const y = useTransform(scrollYProgress, [0, 1], ["-40%", "20%"])
  return (
    <div className="relative h-auto w-full overflow-hidden">
      <motion.div className="absolute h-[140%] w-full" style={{ top: y }}>
        <Image
          alt="Reformer Wellness Club"
          title="Reformer Club"
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
          {/* <p
            ref={ref}
            className="-mt-4 max-w-sm text-wrap font-dm_mono text-sm font-extralight text-pearl"
          >
            1. Un espacio que integra la actividad física{" "}
            <br className="hidden sm:block" /> con el bienestar mental y
            emocional.
          </p> */}
          <div
            ref={ref}
            className="-mt-4 h-[100px] w-[300px] text-wrap font-dm_mono text-sm font-extralight text-pearl sm:w-[350px]"
          >
            {isInView && (
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString(
                      "1. Un espacio que integra la actividad física con el bienestar mental y emocional."
                    )
                    .start()
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandBottom
