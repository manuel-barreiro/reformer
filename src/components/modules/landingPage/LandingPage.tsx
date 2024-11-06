"use client"
import Brand from "@/components/modules/landingPage/Brand/Brand"
import ComingSoon from "@/components/modules/landingPage/ComingSoon"
import Hero from "@/components/modules/landingPage/Hero/Hero"
import QuienesSomos from "@/components/modules/landingPage/QuienesSomos"
import { Suspense, useEffect, useRef } from "react"
import Lenis from "lenis"
import Footer from "@/components/modules/landingPage/Footer/Footer"
import ServiciosGrid from "@/components/modules/landingPage/Servicios/ServiciosGrid"
import ContactForm from "@/components/modules/landingPage/Footer/ContactForm"
import Pilates from "@/components/modules/landingPage/Pilates"
import Paquetes from "@/components/modules/landingPage/Paquetes/Paquetes"
import { ClassPackageProps } from "@/types"

const lenisOptions = {
  duration: 0.8, // Reduced from 1.2
  easing: (t: number) => t, // Simpler easing function
  smoothWheel: true,
  wheelMultiplier: 0.8, // Added to reduce scroll intensity
  touchMultiplier: 1.5,
  infinite: false,
}

export default function LandingPage({
  activeClassPackages,
}: {
  activeClassPackages: ClassPackageProps[]
}) {
  //Lenis smooth scroll
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    lenisRef.current = new Lenis(lenisOptions)

    const raf = (time: number) => {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenisRef.current?.destroy()
      lenisRef.current = null
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
        <Suspense fallback={null}>
          <Paquetes activeClassPackages={activeClassPackages} />
        </Suspense>{" "}
        <ContactForm />
        <Footer />
      </main>
    </>
  )
}
