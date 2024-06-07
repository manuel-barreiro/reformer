import Image from "next/image"
import { logo } from "../../../../public"

export default function DesktopNav() {
  return (
    <nav className="hidden items-start justify-between bg-midnight px-16 py-10 font-thin text-pearl lg:flex">
      <ul className="mt-2 flex gap-12">
        <li>BRAND</li>
        <li>QUIENES SOMOS</li>
      </ul>

      <Image src={logo} width={250} alt="logo" />

      <ul className="mt-2 flex gap-12">
        <li>SERVICIOS</li>
        <li>CONTACTO</li>
      </ul>
    </nav>
  )
}
