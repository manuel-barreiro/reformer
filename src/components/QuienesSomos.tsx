"use client"
import { quienes_somos, cuerpo, bienestar, espiritu, mente } from "../../public"
import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function QuienesSomos() {
  // Parallax
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-17%", "10%"])

  //Framer motion for icons
  const iconAnimationVariants = {
    initial: { y: 15, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  }
  return (
    <section className="flex h-auto w-full flex-col lg:h-[100vh] lg:flex-row">
      <div className="relative h-screen overflow-hidden lg:basis-[40%]">
        <motion.div className="absolute h-[110%] w-full" style={{ top: y }}>
          <Image
            alt="Reformer Wellness Club"
            title="Reformer"
            priority={true}
            className="inset-0 h-full w-full object-cover object-bottom sm:object-center"
            src={quienes_somos}
          />
        </motion.div>
      </div>

      <div
        className="flex h-auto flex-col items-start justify-center bg-pearl px-14 py-20 lg:basis-[60%] lg:py-28 lg:pl-36"
        style={{ cursor: "url(icons/solGreyPebble.svg),auto" }}
      >
        <div className="flex max-w-lg flex-col items-start gap-10 text-justify font-dm_sans">
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
          <div className="grid h-auto w-full grid-cols-2 gap-8 sm:flex sm:items-center sm:justify-between">
            <motion.div
              variants={iconAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, transition: { ease: "easeInOut" } }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex h-32 flex-col items-center justify-center gap-4"
            >
              <Image src={cuerpo} alt="cuerpo" className="h-3/5" />
              <span className="font-dm_mono text-xs text-midnight">CUERPO</span>
            </motion.div>
            <motion.div
              variants={iconAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, transition: { ease: "easeInOut" } }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex h-32 flex-col items-center justify-center gap-4"
            >
              <Image src={mente} alt="mente" className="h-3/5" />
              <span className="font-dm_mono text-xs text-midnight">MENTE</span>
            </motion.div>
            <motion.div
              variants={iconAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, transition: { ease: "easeInOut" } }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex h-32 flex-col items-center justify-center gap-4"
            >
              <Image src={espiritu} alt="espiritu" className="h-3/5" />
              <span className="font-dm_mono text-xs text-midnight">
                ESPÍRITU
              </span>
            </motion.div>
            <motion.div
              variants={iconAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, transition: { ease: "easeInOut" } }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex h-32 flex-col items-center justify-center gap-4"
            >
              <Image src={bienestar} alt="bienestar" className="h-3/5" />
              <span className="font-dm_mono text-xs text-midnight">
                BIENESTAR
              </span>
            </motion.div>
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
