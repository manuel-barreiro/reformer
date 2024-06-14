import Brand from "@/components/Brand/Brand"
import ComingSoon from "@/components/ComingSoon"
import Header from "@/components/Header/Header"
import Hero from "@/components/Hero/Hero"
import QuienesSomos from "@/components/QuienesSomos"

export default function Home() {
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
