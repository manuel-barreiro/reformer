"use client"
import Link from "next/link"
import Image from "next/image"
import notFound from "../../public/images/notFound.webp"

export default function NotFound() {
  return (
    <div className="flex flex-col md:h-[85vh] md:flex-row">
      <div className="flex h-[90vh] flex-col items-center justify-center gap-5 bg-grey_pebble px-10 py-8 text-center font-marcellus text-pearl md:h-auto md:basis-1/2 lg:px-20">
        <span className="mb-3 font-dm_mono text-2xl font-bold tracking-tight sm:text-4xl">
          :(
        </span>

        <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">
          No pudimos encontrar la página solicitada.
        </h1>

        <p className="font-dm_sans font-thin text-pearl/80">
          Intentalo nuevamente, o regresa al inicio.
        </p>

        <Link href={"/"}>
          <button
            type="submit"
            className="w-auto rounded-lg border border-pearl/80 bg-[#110f10] p-3 text-[16px] text-sm font-light text-pearl/80 outline-pearl/80 transition-all duration-100 ease-in-out hover:bg-[#110f10]/40 hover:outline"
          >
            Volver al inicio
          </button>
        </Link>
      </div>
      <Image
        src={notFound}
        alt="404"
        className="hidden basis-1/2 object-cover object-center md:block"
      />
    </div>
  )
}
