import Image from "next/image"
import { logo } from "../../../../public"
import Link from "next/link"

export default function DesktopNav() {
  return (
    <nav className="hidden items-start justify-between bg-midnight px-20 py-8 font-thin text-pearl lg:flex">
      <ul className="mt-2 flex animate-fade-down gap-12 transition animate-normal animate-duration-[3000ms] animate-fill-both animate-once">
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <Link href="#brand">BRAND</Link>
        </li>
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <Link href="#quienesSomos">QUIÉNES SOMOS</Link>
        </li>
      </ul>

      <Link href="#home">
        <Image
          src={logo}
          width={200}
          alt="Reformer Logo"
          priority={true}
          className="animate-fade ease-in-out animate-normal animate-duration-[3000ms] animate-fill-both animate-once"
        />
      </Link>

      <ul className="mt-2 flex animate-fade-down gap-12 transition animate-normal animate-duration-[3000ms] animate-fill-both animate-once">
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <Link href="#servicios">SERVICIOS</Link>
        </li>
        <li className="underline-offset-8 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline hover:brightness-200">
          <Link href="#contacto">CONTACTO</Link>
        </li>
      </ul>
    </nav>
  )
}
