import React from "react"
import { isotipo } from "../../../public"
import Image from "next/image"

function BrandTop() {
  return (
    <div className="flex h-auto flex-col items-center justify-center gap-6 bg-pearl py-10">
      <Image src={isotipo} alt="Isotipo Reformer" width={30} />
      <h2 className="font-marcellus text-xl text-midnight sm:text-2xl md:text-3xl lg:text-4xl">
        {"["} WELLNESS CLUB {"]"} de bienestar integral
      </h2>
      <p className="font-dm_mono text-xs sm:text-base">BS. AS, ARGENTINA</p>
    </div>
  )
}

export default BrandTop
