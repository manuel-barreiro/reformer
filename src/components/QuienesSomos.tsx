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
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "10%"])
  return (
    <section className="flex h-auto w-full flex-col lg:h-[100vh] lg:flex-row">
      <div className="relative h-screen overflow-hidden lg:block lg:basis-[40%]">
        <motion.div className="absolute h-[120%] w-full" style={{ top: y }}>
          <Image
            alt="Reformer Wellness Club"
            title="Reformer"
            priority={true}
            className="inset-0 h-full w-full object-cover object-center"
            src={quienes_somos}
          />
        </motion.div>
      </div>

      <div className="flex h-full flex-col items-center justify-center bg-pearl px-14 py-28 lg:basis-[60%] lg:px-20">
        <div className="flex max-w-lg flex-col items-start gap-7 text-justify font-dm_sans">
          <p className="font-dm_mono text-midnight">QUIENES SOMOS</p>
          <p>
            Hacemos de tu bienestar una prioridad en tu día a día, ofreciéndote
            una experiencia única que no solo se limita al menú de servicios que
            ofrecemos, sino que se extiende a través del espacio, los sentidos y
            la comunidad.
          </p>
          <p>
            Nuestro objetivo? Ayudarte a que tu cuerpo se convierta en tu
            templo, fusionando la conexión entre{" "}
            <span className="font-bold">cuerpo, mente y espíritu</span> en
            perfecto equilibrio para elevar la existencia.
          </p>
          <div className="flex w-full items-center justify-between">
            <Image src={cuerpo} alt="cuerpo" width={60} />
            <Image src={mente} alt="mente" width={50} />
            <Image src={espiritu} alt="espiritu" width={70} />
            <Image src={bienestar} alt="bienestar" width={80} />
          </div>
          <p>
            Nuestro equipo global nos ha enseñado que el verdadero cambio
            proviene del empoderamiento. No se trata únicamente de tomar una
            clase, sino de inculcar las herramientas para que nuestros clientes
            lideren su propio bienestar y construyan un estilo de vida
            sostenible.
          </p>
        </div>
      </div>
    </section>
  )
}
