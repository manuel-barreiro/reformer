"use client"

import { hero } from "../../../public"
import Image from "next/image"
import HeroText from "./HeroText"
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
      // style={{ cursor: "url(icons/sol.svg),auto" }}
    >
      <motion.div className="absolute h-[110%] w-full" style={{ top: y }}>
        <Image
          alt="Reformer Wellness Club"
          title="Reformer"
          priority={true}
          className="inset-0 h-full w-full object-cover object-left"
          src={hero}
        />
      </motion.div>

      <div className="relative flex h-full w-full justify-start px-8 sm:justify-end lg:px-16">
        <HeroText />
      </div>
    </section>
  )
}
