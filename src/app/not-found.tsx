"use client"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "../../public/index"

export default function NotFound() {
  return (
    <section
      className="relative h-screen w-full overflow-hidden sm:h-[90vh]"
      // style={{ cursor: "url(icons/sol.svg),auto" }}
    >
      <Image
        alt="Reformer Wellness Club"
        title="Reformer"
        priority={true}
        className="absolute inset-0 h-full w-full object-cover object-left-bottom"
        src={notFound}
      />

      <div className="relative flex h-full w-full justify-start px-8 lg:px-16">
        <div className="mt-36 flex flex-col justify-start leading-loose lg:mt-32">
          <p className="mb-2 animate-fade-up font-marcellus text-3xl font-medium uppercase text-pearl animate-delay-[1000ms] animate-normal animate-duration-[3000ms] animate-once animate-ease-in-out sm:text-4xl md:text-5xl lg:mb-4 lg:animate-delay-[1500ms] xl:text-6xl">
            Error 404
          </p>
          <p className="mb-2 animate-fade-up font-dm_sans text-lg text-pearl animate-delay-[1000ms] animate-normal animate-duration-[3000ms] animate-once animate-ease-in-out sm:text-4xl md:text-5xl lg:mb-4 lg:animate-delay-[2000ms]">
            No pudimos encontrar la página solicitada.
          </p>
          <Link href={"/"}>
            <button
              type="submit"
              className="mt-4 h-10 w-32 animate-fade-up rounded-lg border border-pearl/80 bg-[#110f10] text-[16px] text-sm font-light text-pearl/80 outline-pearl/80 transition-all duration-100 ease-in-out animate-delay-[1000ms] animate-normal animate-duration-[3000ms] animate-once animate-ease-in-out hover:bg-[#110f10]/40 hover:outline lg:animate-delay-[2500ms]"
            >
              Volver a inicio
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
