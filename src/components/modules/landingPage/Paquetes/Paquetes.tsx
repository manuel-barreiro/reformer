"use client"
import { useRef, memo, useMemo, useState, useEffect } from "react"
import marmolBg from "/public/images/marmolBg.png"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ClassPackageProps } from "@/types"

// Move Paquete component outside and optimize it
const Paquete = memo(({ name }: { name: string }) => {
  return (
    <div className="flex h-full max-w-[300px] flex-col items-center justify-evenly bg-midnight/60">
      <div className="w-full flex-1 border-[2px] border-b-0 border-grey_pebble p-6 text-center">
        <span className="w-full text-lg font-thin">{name}</span>
      </div>
      <div className="flex w-full flex-1 flex-col border-[2px] border-b-0 border-grey_pebble p-6 py-8 text-center font-dm_sans text-sm font-light">
        <span className="mb-2">Duración: 1 mes</span>
        <span>10% OFF pagando en efectivo o transferencia bancaria</span>
      </div>
      <Link href="/checkout" className="w-full" prefetch={false}>
        <button className="w-full flex-1 border-[2px] border-grey_pebble p-6 font-dm_sans text-lg font-bold duration-300 ease-in-out hover:bg-pearlVariant2 hover:text-midnight">
          EMPEZÁ
        </button>
      </Link>
    </div>
  )
})
Paquete.displayName = "Paquete"

export default function Paquetes({
  activeClassPackages,
}: {
  activeClassPackages: ClassPackageProps[]
}) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Memoize the grid className calculation
  const gridClassName = useMemo(() => {
    return cn(
      "grid h-auto w-auto max-w-[1000px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-0",
      activeClassPackages.length === 1 && "md:grid-cols-1 lg:grid-cols-1",
      activeClassPackages.length === 2 && "md:grid-cols-2 lg:grid-cols-2",
      activeClassPackages.length === 3 && "md:grid-cols-3 lg:grid-cols-3",
      activeClassPackages.length === 4 && "md:grid-cols-4 lg:grid-cols-4",
      activeClassPackages.length === 5 &&
        "md:grid-cols-3 lg:grid-cols-3 lg:gap-3"
    )
  }, [activeClassPackages.length])

  // Memoize the packages list
  const packagesList = useMemo(() => {
    if (!isVisible) return null
    return activeClassPackages?.map((pack: ClassPackageProps) => (
      <Paquete key={pack.id} name={pack.name} />
    ))
  }, [activeClassPackages, isVisible])

  return (
    <section
      ref={sectionRef}
      id="paquetes"
      className="relative flex h-auto min-h-[86vh] w-full flex-col items-center justify-center gap-10 overflow-hidden bg-black/80 px-10 py-20 font-dm_mono text-pearl lg:px-20 lg:py-40"
    >
      <div className="absolute -z-10 h-[110%] w-full will-change-transform">
        <Image
          alt="Fondo de marmol"
          title="Fondo de marmol"
          className="inset-0 h-full w-full object-cover object-center"
          src={marmolBg}
          loading="lazy"
          priority={false}
          sizes="100vw"
          quality={75}
        />
      </div>

      <h2 className="text-lg uppercase md:text-xl">Nuestros paquetes</h2>

      <div className={gridClassName}>{packagesList}</div>
    </section>
  )
}
