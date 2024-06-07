import { hero } from "../../public"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative h-screen">
      <Image src={hero} alt="hero image" className="inset-0" />
    </section>
  )
}
