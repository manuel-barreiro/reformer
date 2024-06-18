import { StaticImageData } from "next/image"
import Image from "next/image"

type ServicioProps = {
  img: StaticImageData
  service: string
}

export default function Servicio({ img, service }: ServicioProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-10 bg-midnight/20 transition-all duration-300 ease-in-out hover:bg-midnight/70" />
      <Image
        alt="Reformer Wellness Club"
        title="Reformer"
        priority={true}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src={img}
      />
      <p>{service}</p>
    </div>
  )
}
