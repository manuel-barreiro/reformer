import { useRef } from "react"
import { useScroll, useTransform } from "framer-motion"

export const useParallax = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return { sectionRef, y }
}
