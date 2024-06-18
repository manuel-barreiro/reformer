import { StaticImageData } from "next/image"
import Image from "next/image"

type ServicioProps = {
  img: StaticImageData
  service: string
}

export default function Servicio({ img, service }: ServicioProps) {
  return (
    <div className="relative flex h-[80vh] w-full flex-col items-center justify-center overflow-hidden md:h-screen">
      <div className="absolute inset-0 z-10 bg-midnight/30 transition-all duration-300 ease-in-out hover:bg-midnight/70" />
      <Image
        alt="Reformer Wellness Club"
        title="Reformer"
        priority={true}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src={img}
      />
      <p className="font-marcellus text-4xl uppercase text-white md:text-5xl">
        {service}
      </p>
    </div>
  )
}
