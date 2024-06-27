import logoIzqFooter from "../../public/icons/logoIzqFooter.svg"
import Image from "next/image"
import Link from "next/link"
import instagram from "../../public/icons/instagram.svg"
import location from "../../public/icons/location.svg"
import email from "../../public/icons/email.svg"
import whatsapp from "../../public/icons/whatsapp.svg"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Footer() {
  return (
    <footer className="bg-midnight px-10 pb-10 pt-20 lg:px-20">
      <div className="relative mx-auto">
        <div className="mb-12 h-[1px] w-full bg-pearl" />
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center md:justify-between">
          <Link href="#home">
            <Image src={logoIzqFooter} alt="Reformer Logo" width={200} />
          </Link>

          <TooltipProvider>
            <div className="-ml-1 -mt-5 flex gap-3 text-pearl md:hidden">
              <Tooltip>
                <TooltipTrigger>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <Image width={30} src={instagram} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    @reformerclub
                  </span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <a
                    href="https://wa.me/+5491128252853"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <Image width={30} src={whatsapp} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    +54 9 11 2825 2853
                  </span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <a
                    href="mailto:consultas@reformer.com.ar"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <Image width={30} src={email} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    consultas@reformer.com.ar
                  </span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <a target="_blank" className="flex items-center gap-2">
                    <Image width={30} src={location} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    BUENOS AIRES
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

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
          <TooltipProvider>
            <div className="-ml-1 hidden gap-3 uppercase text-pearl md:flex">
              <Tooltip>
                <TooltipTrigger>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <Image width={30} src={instagram} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    @reformerclub
                  </span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <a
                    href="https://wa.me/+5491128252853"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <Image width={30} src={whatsapp} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    +54 9 11 2825-2853
                  </span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <a
                    href="mailto:consultas@reformer.com.ar"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <Image width={30} src={email} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    consultas@reformer.com.ar
                  </span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <a target="_blank" className="flex items-center gap-2">
                    <Image width={30} src={location} alt="ig" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-grey_pebble text-pearl">
                  <span className="font-dm_mono text-xs font-medium">
                    BUENOS AIRES
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <p className="text-center text-sm text-grey_pebble lg:text-right">
            Reformer Wellness Club &reg; 2024
          </p>
        </div>
      </div>
    </footer>
  )
}
