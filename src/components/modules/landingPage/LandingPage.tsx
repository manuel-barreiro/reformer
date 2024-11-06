"use client"
import Brand from "@/components/modules/landingPage/Brand/Brand"
import ComingSoon from "@/components/modules/landingPage/ComingSoon"
import Hero from "@/components/modules/landingPage/Hero/Hero"
import QuienesSomos from "@/components/modules/landingPage/QuienesSomos"
import { useEffect, useRef } from "react"
import Lenis from "lenis"
import Footer from "@/components/modules/landingPage/Footer/Footer"
import ServiciosGrid from "@/components/modules/landingPage/Servicios/ServiciosGrid"
import ContactForm from "@/components/modules/landingPage/Footer/ContactForm"
import Pilates from "@/components/modules/landingPage/Pilates"
import Paquetes from "@/components/modules/landingPage/Paquetes/Paquetes"
import { ClassPackageProps } from "@/types"

export default function LandingPage({
  activeClassPackages,
}: {
  activeClassPackages: ClassPackageProps[]
}) {
  //Lenis smooth scroll
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    })

    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  return (
    <>
      <main style={{ cursor: "url(/icons/solPearl.svg),auto" }}>
        <div className="h-0 w-full scroll-mt-32" id="home" />
        <Hero />
        <Brand />
        <QuienesSomos />
        <ComingSoon />
        <ServiciosGrid />
        <Pilates />
        <Paquetes activeClassPackages={activeClassPackages} />
        <ContactForm />
        <Footer />
      </main>
    </>
  )
}
