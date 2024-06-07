import Image from "next/image"
import { logo } from "../../../../public"
import DesktopNav from "./DesktopNav"
import MobileNav from "./MobileNav"

export default function NavBar() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}
