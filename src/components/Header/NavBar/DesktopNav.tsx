import Image from "next/image"
import { logo } from "../../../../public"
import Link from "next/link"
import ScrollLink from "@/components/ScrollLink"

export default function DesktopNav() {
  return (
    <nav className="hidden items-start justify-between bg-midnight px-20 py-8 font-thin text-pearl lg:flex">
      <ul className="mt-2 flex animate-fade-down gap-12 transition animate-normal animate-duration-[3000ms] animate-fill-both animate-once">
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <ScrollLink id="brand">BRAND</ScrollLink>
        </li>
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <ScrollLink id="quienesSomos">QUIÉNES SOMOS</ScrollLink>
        </li>
      </ul>

      <ScrollLink id="home">
        <Image
          src={logo}
          width={200}
          alt="logo"
          className="animate-fade ease-in-out animate-normal animate-duration-[3000ms] animate-fill-both animate-once"
        />
      </ScrollLink>

      <ul className="mt-2 flex animate-fade-down gap-12 transition animate-normal animate-duration-[3000ms] animate-fill-both animate-once">
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <ScrollLink id="servicios">SERVICIOS</ScrollLink>
        </li>
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <ScrollLink id="contacto">CONTACTO</ScrollLink>
        </li>
      </ul>
    </nav>
  )
}
