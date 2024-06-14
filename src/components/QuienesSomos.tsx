"use client"
import { quienes_somos, cuerpo, bienestar, espiritu, mente } from "../../public"
import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function QuienesSomos() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-30%", "10%"])
  return (
    <section className="flex h-auto w-full flex-col lg:h-[100vh] lg:flex-row">
      <div className="relative h-screen overflow-hidden lg:block lg:basis-[40%]">
        <motion.div className="absolute h-[110%] w-full" style={{ top: y }}>
          <Image
            alt="Reformer Wellness Club"
            title="Reformer"
            priority={true}
            className="inset-0 h-full w-full object-cover object-center"
            src={quienes_somos}
          />
        </motion.div>
      </div>

      <div className="flex h-auto flex-col items-center justify-center bg-pearl px-14 py-28 lg:basis-[60%] lg:px-20">
        <div className="flex max-w-lg flex-col items-start gap-9 text-justify font-dm_sans">
          <p className="font-dm_mono text-midnight">QUIENES SOMOS</p>
          <p>
            Hacemos de tu bienestar nuestra prioridad. Reformer Wellness Club
            ofrece una experiencia única para desarrollar y perfeccionar tu
            yo-físico con practicas como Pilates y Yoga, y a su vez, enfocarnos
            y elevar consciencia.{" "}
            <span className="font-bold">
              Fluimos con intención, con fuerza, con flexibilidad y con nuestro
              fuego interno.
            </span>
          </p>
          <p>
            ¿Nuestro objetivo? Energizarte, desafiarte y centrarte con nuestras
            clases con el propósito de que logres una transformación tanto
            externa como interna. Buscamos que logres esa plenitud integral.
          </p>
          <div className="grid w-full grid-cols-2 gap-10 sm:flex sm:h-20 sm:items-center sm:justify-between">
            <div className="flex h-full flex-col items-center gap-4">
              <Image src={cuerpo} alt="cuerpo" className="h-4/5" />
              <span className="font-dm_mono text-xs text-midnight">CUERPO</span>
            </div>
            <div className="flex h-full flex-col items-center gap-4">
              <Image src={mente} alt="mente" className="h-4/5" />
              <span className="font-dm_mono text-xs text-midnight">MENTE</span>
            </div>
            <div className="flex h-full flex-col items-center gap-4">
              <Image src={espiritu} alt="espiritu" className="h-4/5" />
              <span className="font-dm_mono text-xs text-midnight">
                ESPÍRITU
              </span>
            </div>
            <div className="flex h-full flex-col items-center gap-4">
              <Image src={bienestar} alt="bienestar" className="h-4/5" />
              <span className="font-dm_mono text-xs text-midnight">
                BIENESTAR
              </span>
            </div>
          </div>
          <p>
            El verdadero cambio proviene de tomar consciencia sobre nuestra
            realidad, y aceptarla para luego reformarla y en última instancia
            TRANSFORMARLA. Nosotros buscamos darte las herramientas básicas para
            que puedas poner mente cuerpo y alma a la obra.
          </p>
        </div>
      </div>
    </section>
  )
}
