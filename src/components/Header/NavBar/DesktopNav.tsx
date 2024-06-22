import Image from "next/image"
import { logo } from "../../../../public"
import Link from "next/link"

export default function DesktopNav() {
  return (
    <nav className="hidden items-start justify-between bg-midnight px-20 py-8 font-thin text-pearl lg:flex">
      <ul className="mt-2 flex animate-fade-down gap-12 transition animate-normal animate-duration-[3000ms] animate-fill-both animate-once">
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          BRAND
        </li>
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          QUIÉNES SOMOS
        </li>
      </ul>

      <Link href={"/"}>
        <Image
          src={logo}
          width={200}
          alt="logo"
          className="animate-fade ease-in-out animate-normal animate-duration-[3000ms] animate-fill-both animate-once"
        />
      </Link>

      <ul className="mt-2 flex animate-fade-down gap-12 transition animate-normal animate-duration-[3000ms] animate-fill-both animate-once">
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          SERVICIOS
        </li>
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          CONTACTO
        </li>
      </ul>
    </nav>
  )
}
