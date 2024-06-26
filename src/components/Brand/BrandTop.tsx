import { isotipo } from "../../../public"
import Image from "next/image"

function BrandTop() {
  return (
    <div
      className="flex h-auto flex-col items-center justify-center gap-6 bg-pearl py-10"
      style={{ cursor: "url(icons/solGreyPebble.svg),auto" }}
    >
      <Image src={isotipo} alt="Isotipo Reformer" width={40} />
      <h2 className="text-center font-marcellus text-xl text-midnight sm:text-2xl md:text-3xl lg:text-4xl">
        Más que estudio de pilates y yoga;
        <br /> un {"["} wellness club {"]"}
      </h2>
      <p className="font-dm_mono text-xs sm:text-base">BS. AS, ARGENTINA</p>
    </div>
  )
}

export default BrandTop
