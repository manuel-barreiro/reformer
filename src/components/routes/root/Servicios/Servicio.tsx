import { StaticImageData } from "next/image"
import Image from "next/image"
import { ServicioInfo } from "../../../types"

type ServicioProps = {
  img: StaticImageData
  service: string
  info: ServicioInfo[]
}

export default function Servicio({ img, service, info }: ServicioProps) {
  return (
    <div className="group relative flex h-auto min-h-screen w-full animate-fade flex-col items-center justify-center gap-12 overflow-hidden hover:justify-end hover:transition-all hover:ease-in-out sm:pt-10 lg:pt-0">
      <div className="absolute inset-0 z-30 bg-midnight/40 duration-1000 group-hover:bg-midnight/70 group-hover:transition-all group-hover:ease-in-out" />
      <Image
        alt="Reformer Wellness Club"
        title="Reformer"
        priority={true}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src={img}
      />
      <p className="z-30 font-marcellus text-4xl uppercase text-pearl group-hover:animate-fade-up group-hover:animate-duration-[1000ms] group-hover:animate-once group-hover:animate-ease-in-out md:text-5xl">
        {service}
      </p>
      <div className="z-30 hidden w-full text-pearl/90 group-hover:block group-hover:animate-fade group-hover:animate-duration-[1500ms] group-hover:animate-ease-in-out">
        {info.map((info, i) => (
          <div
            className="flex w-full flex-col items-center justify-center gap-2 border-t border-pearl bg-midnight/70 p-4 font-thin"
            key={i}
          >
            <p className="text-center text-lg font-medium text-pearl">
              {info.name}
            </p>
            {info.intensity && (
              <div className="flex h-full w-full items-center justify-center gap-1">
                <div className="flex h-full basis-2/6 flex-col items-center justify-start gap-0">
                  <span>Intensidad</span>
                  {typeof info.intensity === "number" && (
                    <div className="flex w-full items-center justify-center gap-1">
                      {[...Array(info.intensity)].map((_, intIndx) => (
                        <div
                          className="h-3 w-3 rounded-full bg-pearl"
                          key={intIndx}
                        ></div>
                      ))}
                      {[...Array(5 - info.intensity)].map((_, intIndx) => (
                        <div
                          className="h-3 w-3 rounded-full border-[0.5px] border-pearl bg-[#82817c]"
                          key={intIndx}
                        ></div>
                      ))}
                    </div>
                  )}

                  {typeof info.intensity === "string" && (
                    <span className="-mt-2">{info.intensity}</span>
                  )}
                </div>
                <div className="flex h-full max-w-sm basis-2/6 flex-col items-center justify-center">
                  <span className="leading-none">{info.zone}</span>
                </div>
              </div>
            )}
            {info.description && (
              <p className="mb-5 px-3 text-center">{info.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
