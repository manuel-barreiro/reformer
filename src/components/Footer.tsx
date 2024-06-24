import React from "react"
import { footer_logo } from "../../public"
import Image from "next/image"
import ScrollLink from "@/components/ScrollLink"

export default function Footer() {
  return (
    <footer className="bg-midnight px-10 pb-10 pt-20 lg:px-20">
      <div className="relative mx-auto">
        <div className="mb-12 h-[1px] w-full bg-pearl" />
        <div className="flex flex-col items-start gap-12 sm:flex-row sm:justify-between">
          <ScrollLink id="home">
            <Image src={footer_logo} alt="footer logo" width={200} />
          </ScrollLink>

          <ul className="flex flex-col items-start gap-2">
            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <ScrollLink id="brand">Brand</ScrollLink>
            </li>

            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <ScrollLink id="quienesSomosMobile">Quiénes somos</ScrollLink>
            </li>

            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <ScrollLink id="servicios">Servicios</ScrollLink>
            </li>

            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <ScrollLink id="contacto">Contacto</ScrollLink>
            </li>
          </ul>
        </div>

        <p className="mt-12 text-center text-sm text-grey_pebble lg:text-right">
          Reformer Wellness Club &reg; 2024. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
