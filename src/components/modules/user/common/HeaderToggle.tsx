"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export default function HeaderToggle({
  title,
  filterOptions,
}: {
  title: string
  filterOptions?: string[]
}) {
  const [filter, setFilter] = useState<string | undefined>(
    filterOptions ? filterOptions[0] : undefined
  )

  return (
    <div className="flex w-full items-center justify-around border-b border-grey_pebble pb-6 font-dm_sans font-medium uppercase">
      <h1 className="py-2 text-xl">{title}</h1>

      {filterOptions && (
        <div className="bg-pearlVariant flex items-center rounded-full">
          <button
            onClick={() => setFilter(filterOptions[0])}
            className={cn(
              "rounded-full px-12 py-2 text-grey_pebble",
              filter === filterOptions[0] && "bg-grey_pebble text-pearl"
            )}
          >
            {filterOptions[0]}
          </button>
          <button
            onClick={() => setFilter(filterOptions[1])}
            className={cn(
              "rounded-full px-12 py-2 text-grey_pebble",
              filter === filterOptions[1] && "bg-grey_pebble text-pearl"
            )}
          >
            {filterOptions[1]}
          </button>
        </div>
      )}
    </div>
  )
}
