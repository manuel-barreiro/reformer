"use client"
import Brand from "@/components/modules/root/Brand/Brand"
import ComingSoon from "@/components/modules/root/ComingSoon"
import Hero from "@/components/modules/root/Hero/Hero"
import QuienesSomos from "@/components/modules/root/QuienesSomos"
import { useEffect } from "react"
import Lenis from "lenis"
import Footer from "@/components/modules/root/Footer/Footer"
import ServiciosGrid from "@/components/modules/root/Servicios/ServiciosGrid"
import ContactForm from "@/components/modules/root/Footer/ContactForm"
import Pilates from "@/components/modules/root/Pilates"
import Paquetes from "@/components/modules/root/Paquetes"
import Header from "@/components/modules/root/Header/Header"

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
    <>
      <Header />
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
    </>
  )
}
