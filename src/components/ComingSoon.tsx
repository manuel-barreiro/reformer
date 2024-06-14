"use client"
import React from "react"
import Typewriter from "typewriter-effect"

export default function ComingSoon() {
  return (
    <section className="flex h-[50vh] w-full items-center justify-center bg-grey_pebble">
      <h3 className="flex w-full flex-col items-center justify-center gap-10 text-center font-marcellus text-3xl text-pearl md:flex-row lg:text-4xl">
        COMING SOON
        <span className="w-[23rem] border-b-[1px] border-white font-dm_sans font-extralight md:w-[32rem]">
          <Typewriter
            options={{
              strings: [
                "PERFECT BALANCE",
                "HOLISTIC RENEWAL",
                "INNER STRENGTH",
                "SERENITY IN MOTION",
                "ELEVATED VITALITY",
                "REVITALIZATION",
                "TRANSFORMATION",
                "PILATES",
                "YOGA",
                "MASSAGES",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </h3>
    </section>
  )
}
