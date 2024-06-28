"use client"
import { cuerpo, bienestar, espiritu, mente } from "../../public"
import quienesSomos from "../../public/images/quienesSomos.webp"
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
    <section
      className="flex h-auto w-full scroll-mt-28 flex-col bg-pearl lg:h-[100vh] lg:flex-row"
      id="quienesSomos"
    >
      <div className="relative h-screen overflow-hidden lg:basis-[40%]">
        <motion.div className="absolute h-[110%] w-full" style={{ top: y }}>
          <Image
            alt="Reformer Club"
            title="Reformer Wellness Club"
            className="inset-0 h-full w-full object-cover object-bottom sm:object-center"
            src={quienesSomos}
          />
        </motion.div>
      </div>

      <div
        className="flex h-auto scroll-mt-28 flex-col items-start justify-center px-14 py-20 md:items-center lg:basis-[60%] lg:items-start lg:py-28 lg:pl-36"
        style={{ cursor: "url(icons/solGreyPebble.svg),auto" }}
        id="quienesSomosMobile"
      >
        <div className="flex max-w-lg flex-col items-start gap-10 text-justify font-dm_sans">
          <p className="font-dm_mono text-midnight">QUIÉNES SOMOS</p>
          <p>
            Somos un estudio de power y HIIT pilates. Somos un estudio de yoga.
            Somos un lugar para regenerarte y recuperarte con stretching,
            masajes y técnicas de respiración.{" "}
            <span className="font-bold">
              Somos el espacio en donde empieza tu transformación.
            </span>
          </p>
          <p>
            Somos un club que ofrece una experiencia única para maximizar tu
            potencial y mantenerte rindiendo al 100%. Nosotros hacemos que tu
            bienestar y metas de realizamiento físico, sean nuestra prioridad.
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
            Te damos el know how y el entrenamiento necesario para{" "}
            <span className="font-bold">
              poner cuerpo, mente y alma a la obra.{" "}
            </span>
            Sumáte para convertirte en tu mejor version, empezá hoy.
          </p>
        </div>
      </div>
    </section>
  )
}
