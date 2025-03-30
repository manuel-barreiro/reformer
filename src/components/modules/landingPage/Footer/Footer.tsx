import { LogoIzqFooter } from "@/assets/icons"
import Link from "next/link"
import ContactInfo from "./ContactInfo"

export default function Footer() {
  return (
    <footer className="bg-midnight px-10 pb-10 pt-20 lg:px-20">
      <div className="relative mx-auto">
        <div className="mb-12 h-[1px] w-full bg-pearl" />
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center md:justify-between">
          <Link href="#home">
            <LogoIzqFooter className="w-[200px] text-pearl" />
          </Link>
          <div className="-ml-1 -mt-5 flex gap-3 text-pearl md:hidden">
            <ContactInfo />
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

        <div className="mt-10 flex flex-col items-center gap-5 md:flex-row md:justify-between">
          <div className="-ml-1 hidden gap-3 uppercase text-pearl md:flex">
            <ContactInfo />
          </div>
          <div className="flex flex-col items-end">
            <p className="text-center text-sm text-grey_pebble lg:text-right">
              Reformer Wellness Club &reg; 2024
            </p>
            <a
              href="https://www.instagram.com/cs__creativestudio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              className="text-xs text-grey_pebble transition-opacity hover:underline hover:opacity-80 sm:text-sm"
            >
              DESIGNED BY CS CREATIVE STUDIO
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
