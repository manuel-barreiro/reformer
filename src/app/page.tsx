"use client"
import Brand from "@/components/Brand/Brand"
import ComingSoon from "@/components/ComingSoon"
import Header from "@/components/Header/Header"
import Hero from "@/components/Hero/Hero"
import QuienesSomos from "@/components/QuienesSomos"
import { useEffect } from "react"
import Lenis from "lenis"

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis()

    lenis.on("scroll", (e: any) => {
      console.log(e)
    })

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])
  return (
    <main className="">
      <Header />
      <Hero />
      <Brand />
      <QuienesSomos />
      <ComingSoon />
    </main>
  )
}
