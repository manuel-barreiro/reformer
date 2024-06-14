import Image from "next/image"
import { logo } from "../../../../public"
import Link from "next/link"

export default function DesktopNav() {
  return (
    <nav className="hidden items-start justify-between bg-midnight px-16 py-8 font-thin text-pearl lg:flex">
      <ul className="mt-2 flex gap-12">
        <li className="pointer-events-auto animate-fade-down cursor-pointer transition duration-500 animate-normal animate-duration-[3000ms] animate-fill-both animate-once hover:brightness-200 focus-visible:outline-0">
          BRAND
        </li>
        <li className="pointer-events-auto animate-fade-down cursor-pointer transition duration-500 animate-normal animate-duration-[3000ms] animate-fill-both animate-once hover:brightness-200 focus-visible:outline-0">
          QUIENES SOMOS
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

      <ul className="mt-2 flex gap-12">
        <li className="pointer-events-auto animate-fade-down cursor-pointer transition duration-500 animate-normal animate-duration-[3000ms] animate-fill-both animate-once hover:brightness-200 focus-visible:outline-0">
          SERVICIOS
        </li>
        <li className="pointer-events-auto animate-fade-down cursor-pointer transition duration-500 animate-normal animate-duration-[3000ms] animate-fill-both animate-once hover:brightness-200 focus-visible:outline-0">
          CONTACTO
        </li>
      </ul>
    </nav>
  )
}
