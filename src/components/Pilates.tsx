"use client"
import { useRef } from "react"
import { seccionPilates } from "../../public"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Pilates() {
  //Parallax
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  //Framer motion animation
  const pilatesAnimationVariants = {
    initial: { y: 15, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  }

  const listAnimationRight = {
    initial: { x: -15, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  }
  return (
    <section
      ref={sectionRef}
      className="relative grid h-auto w-full grid-cols-1 items-start gap-10 overflow-hidden px-10 py-20 lg:grid-cols-2 lg:items-center lg:px-20 lg:py-40"
    >
      <motion.div className="absolute -z-10 h-[110%] w-full" style={{ top: y }}>
        <Image
          alt="Pilates"
          title="Reformer Club Pilates"
          className="inset-0 h-full w-full object-cover object-center"
          src={seccionPilates}
        />
      </motion.div>

      <div className="flex w-full justify-center">
        <motion.div
          variants={pilatesAnimationVariants}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.9, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex h-auto flex-col items-start gap-5 rounded-3xl bg-[#676765]/90 p-8 text-justify text-pearl sm:max-w-[80%] md:p-12 lg:max-w-[90%] xl:p-20"
        >
          <h4 className="font-marcellus text-4xl lg:text-5xl xl:text-6xl">
            PILATES
          </h4>
          <p className="text-base font-thin lg:text-lg">
            Pilates es un sistema de entrenamiento preciso y con movimientos que
            buscan ser intensos.
          </p>
          <p className="flex flex-col justify-end border-l border-pearl p-0 pl-5 text-base font-thin lg:text-lg">
            Destinado a trabajar los músculos profundos utilizando el cuerpo
            entero y no los músculos de forma aislada.
          </p>
        </motion.div>
      </div>

      <div className="flex w-full justify-center text-pearl">
        <ul className="ml-5 flex list-disc flex-col gap-4 text-justify text-base font-thin sm:max-w-[80%] lg:max-w-[90%] lg:text-lg">
          <motion.li
            variants={listAnimationRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1 }}
          >
            Trabajando el cuerpo entero se logra tonificar, definir pero al
            mismo tiempo alargar ya que se trabaja constantemente con
            flexibilización.
          </motion.li>
          <motion.li
            variants={listAnimationRight}
            initial="initial"
            viewport={{ once: true }}
            whileInView="animate"
            transition={{ duration: 0.9, delay: 1.5 }}
          >
            La piedra angular en Pilates corresponde a los músculos abdominales
            o CORE, los músculos lumbares y los glúteos. Todos los ejercicios
            solicitan esta parte del cuerpo.
          </motion.li>
          <motion.li
            variants={listAnimationRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 2 }}
          >
            El trabajo de respiración realizado a través de la práctica da la
            sensación de revitalización y no de cansancio.
          </motion.li>
          <motion.li
            variants={listAnimationRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 2.5 }}
          >
            Con una rutina regular de Pilates de dos clases a la semana, los
            cambios se deben notar en las cinco semanas.
          </motion.li>
        </ul>
      </div>
    </section>
  )
}
