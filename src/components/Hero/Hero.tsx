import { hero } from "../../../public"
import Image from "next/image"
import HeroText from "./HeroText"

export default function Hero() {
  return (
    <section className="relative h-[80dvh] w-full md:h-[90dvh]">
      <Image
        alt="Reformer Wellness Club"
        title="Reformer"
        priority={true}
        className="absolute inset-0 h-full w-full object-cover object-left"
        src={hero}
      />
      <div className="relative flex h-full w-full justify-start px-8 sm:justify-end lg:px-16">
        <HeroText />
      </div>
    </section>
  )
}
