import React from "react"
import { footer_logo } from "../../public"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Mail, Phone, Map } from "lucide-react"
export default function Footer() {
  return (
    <footer className="bg-midnight px-10 pb-10 pt-20 lg:px-20">
      <div className="relative mx-auto">
        <div className="mb-12 h-[1px] w-full bg-pearl" />
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center md:justify-between">
          <Link href="#home">
            <Image src={footer_logo} alt="Reformer Logo" width={200} />
          </Link>

          <div className="flex flex-col gap-3 text-pearl">
            <a
              href="https://www.instagram.com"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Instagram className="w-auto" />
              <span>reformerclub</span>
            </a>
            <a
              href="mailto:consultas@reformer.com.ar"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Mail className="w-auto" />
              <span>consultas@reformer.com.ar</span>
            </a>
            <a
              href="tel:+5491126789083"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Phone className="w-auto" />
              <span>+54 9 11 2678-9083</span>
            </a>
            <a target="_blank" className="flex items-center gap-2">
              <Map className="w-auto" />
              <span>Avenida Benavídez 1289</span>
            </a>
          </div>

          <ul className="flex flex-col items-end gap-2 self-end">
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
