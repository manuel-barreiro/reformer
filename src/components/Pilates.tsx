"use client"
import { useRef } from "react"
import { seccionPilates } from "../../public"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Pilates() {
  return (
    <section className="relative grid h-auto w-full grid-cols-1 items-start gap-10 overflow-hidden px-10 py-20 sm:items-center lg:grid-cols-2 lg:gap-3 lg:px-20 lg:py-40">
      <div className="absolute -z-10 h-full w-full">
        <Image
          alt="Reformer Wellness Club"
          title="Reformer"
          priority={true}
          className="inset-0 h-full w-full object-cover object-left"
          src={seccionPilates}
        />
      </div>

      <div className="flex h-auto flex-col items-start gap-5 rounded-3xl bg-[#676765]/50 p-8 text-justify text-pearl md:max-w-[80%] md:p-12 xl:p-20">
        <h4 className="font-marcellus text-4xl lg:text-6xl">PILATES</h4>
        <p className="text-base font-thin lg:text-lg">
          Pilates es un sistema de entrenamiento preciso y con movimientos que
          buscan ser intensos.
        </p>
        <p className="flex flex-col justify-end border-l border-pearl p-0 pl-5 text-base font-thin lg:text-lg">
          Destinado a trabajar los músculos profundos utilizando el cuerpo
          entero y no los músculos de forma aislada.
        </p>
      </div>

      <div className="text-pearl md:max-w-[80%]">
        <ul className="ml-5 flex list-disc flex-col gap-4 text-justify text-base font-thin lg:text-lg">
          <li>
            Trabajando el cuerpo entero se logra tonificar, definir pero al
            mismo tiempo alargar ya que se trabaja constantemente con
            flexibilización.
          </li>
          <li>
            La piedra angular en Pilates corresponde a los músculos abdominales
            o CORE, los músculos lumbares y los glúteos. Todos los ejercicios
            solicitan esta parte del cuerpo.
          </li>
          <li>
            El trabajo de respiración realizado a través de la práctica da la
            sensación de revitalización y no de cansancio.
          </li>
          <li>
            Con una rutina regular de Pilates de dos clases a la semana, los
            cambios se deben notar en las cinco semanas.
          </li>
        </ul>
      </div>
    </section>
  )
}
