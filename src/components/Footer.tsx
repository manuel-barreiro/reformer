import React from "react"
import { footer_logo } from "../../public"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-midnight">
      <div className="relative mx-auto px-10 py-16 lg:px-16 lg:pt-24">
        <div className="mb-12 h-[1px] w-full bg-pearl" />
        <div className="flex flex-col items-start gap-12 sm:flex-row sm:justify-between">
          <Image src={footer_logo} alt="footer logo" width={250} />

          <ul className="flex flex-col items-start gap-2">
            <li>
              <a
                className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0"
                href="#"
              >
                {" "}
                Brand{" "}
              </a>
            </li>

            <li>
              <a
                className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0"
                href="#"
              >
                {" "}
                Quienes somos{" "}
              </a>
            </li>

            <li>
              <a
                className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0"
                href="#"
              >
                {" "}
                Servicios{" "}
              </a>
            </li>

            <li>
              <a
                className="pointer-events-auto text-grey_pebble transition duration-500 hover:brightness-200 focus-visible:outline-0"
                href="#"
              >
                {" "}
                Contacto{" "}
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-12 text-center text-sm text-grey_pebble lg:text-right">
          Reformer Wellness Club &copy; 2024. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
