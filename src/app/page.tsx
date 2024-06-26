"use client"
import Brand from "@/components/Brand/Brand"
import ComingSoon from "@/components/ComingSoon"
import Hero from "@/components/Hero"
import QuienesSomos from "@/components/QuienesSomos"
import { useEffect } from "react"
import Lenis from "lenis"
import Footer from "@/components/Footer"
import ServiciosGrid from "@/components/Servicios/ServiciosGrid"
import ContactForm from "@/components/ContactForm"
import Pilates from "@/components/Pilates"

export default function Home() {
  //Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <main className="">
      <div className="h-0 w-full scroll-mt-32" id="home" />
      <Hero />
      <Brand />
      <QuienesSomos />
      <ComingSoon />
      <ServiciosGrid />
      <Pilates />
      <ContactForm />
      <Footer />
    </main>
  )
}
