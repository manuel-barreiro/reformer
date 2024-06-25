import React from "react"
import { footer_logo } from "../../public"
import Image from "next/image"
import Link from "next/link"
export default function Footer() {
  return (
    <footer className="bg-midnight px-10 pb-10 pt-20 lg:px-20">
      <div className="relative mx-auto">
        <div className="mb-12 h-[1px] w-full bg-pearl" />
        <div className="flex flex-col items-start gap-12 sm:flex-row sm:justify-between">
          <Link href="#home">
            <Image src={footer_logo} alt="footer logo" width={200} />
          </Link>

          <ul className="flex flex-col items-start gap-2">
            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <Link href="#brand">Brand</Link>
            </li>

            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <Link href="#quienesSomosMobile">Quiénes somos</Link>
            </li>

            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <Link href="#servicios">Servicios</Link>
            </li>

            <li className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0">
              <Link href="#contacto">Contacto</Link>
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
