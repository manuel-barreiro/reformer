"use client"

import Image from "next/image"
import { logo } from "../../../../public"
import { useState } from "react"
import ScrollLink from "@/components/ScrollLink"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between bg-midnight px-10 py-8 lg:hidden">
      <ScrollLink id="hero">
        <Image
          src={logo}
          width={150}
          alt="logo"
          className="z-50 animate-fade ease-in-out animate-normal animate-duration-[3000ms] animate-fill-both animate-once"
        />
      </ScrollLink>

      {/* Botón para abrir o cerrar menú */}
      {!open ? (
        <div className="z-50 transition duration-[3s]">
          <button
            type="button"
            className="pointer-events-auto transition duration-500 hover:brightness-200 focus-visible:outline-0"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <span className="flex h-[36px] w-[36px] flex-col justify-center space-y-[11px]">
              <span className="h-[2px] w-full bg-pearl transition duration-150 ease-in-out"></span>
              <span className="h-[2px] w-full bg-pearl transition duration-150 ease-in-out"></span>
            </span>
          </button>
        </div>
      ) : (
        <div className="z-50 transition duration-[3s]">
          <button
            type="button"
            className="pointer-events-auto transition duration-500 hover:brightness-200 focus-visible:outline-0"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Dismiss main menu dialog</span>
            <span className="flex h-[36px] w-[36px] flex-col justify-center space-y-[11px]">
              <span className="h-[2px] w-full translate-y-[7px] rotate-45 bg-pearl transition duration-150 ease-in-out"></span>
              <span className="h-[2px] w-full translate-y-[-6px] -rotate-45 bg-pearl transition duration-150 ease-in-out"></span>
            </span>
          </button>
        </div>
      )}

      {open && (
        <div className="pointer-events-auto fixed inset-0 z-40 flex animate-fade flex-col justify-center overflow-auto bg-midnight px-10 transition duration-500 animate-duration-1000 animate-once animate-ease-in-out">
          <ul className="flex flex-col gap-6 text-3xl text-pearl sm:text-4xl">
            <li
              onClick={() => setOpen(false)}
              className="pointer-events-auto cursor-pointer transition duration-500 hover:brightness-200 focus-visible:outline-0"
            >
              <ScrollLink id="brand">BRAND {">"}</ScrollLink>
            </li>
            <li
              onClick={() => setOpen(false)}
              className="pointer-events-auto cursor-pointer transition duration-500 hover:brightness-200 focus-visible:outline-0"
            >
              <ScrollLink id="quienesSomosMobile">
                QUIÉNES SOMOS {">"}
              </ScrollLink>
            </li>
            <li
              onClick={() => setOpen(false)}
              className="pointer-events-auto cursor-pointer transition duration-500 hover:brightness-200 focus-visible:outline-0"
            >
              <ScrollLink id="servicios">SERVICIOS {">"}</ScrollLink>
            </li>
            <li
              onClick={() => setOpen(false)}
              className="pointer-events-auto cursor-pointer transition duration-500 hover:brightness-200 focus-visible:outline-0"
            >
              <ScrollLink id="contacto">CONTACTO {">"}</ScrollLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
