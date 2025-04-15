import React from "react"
import Image from "next/image"

export default function ReformerLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center space-y-6 p-6">
      <Image
        src="/icons/ISOTIPO.svg"
        alt="loader"
        width={100}
        height={100}
        className="animate-pulse"
      />
    </div>
  )
}
