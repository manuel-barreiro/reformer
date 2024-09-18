"use client"
import Brand from "@/components/routes/root/Brand/Brand"
import ComingSoon from "@/components/routes/root/ComingSoon"
import Hero from "@/components/routes/root/Hero/Hero"
import QuienesSomos from "@/components/routes/root/QuienesSomos"
import { useEffect } from "react"
import Lenis from "lenis"
import Footer from "@/components/routes/root/Footer/Footer"
import ServiciosGrid from "@/components/routes/root/Servicios/ServiciosGrid"
import ContactForm from "@/components/routes/root/Footer/ContactForm"
import Pilates from "@/components/routes/root/Pilates"
import Paquetes from "@/components/routes/root/Paquetes"

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
      <Paquetes />
      <ContactForm />
      <Footer />
    </main>
  )
}
