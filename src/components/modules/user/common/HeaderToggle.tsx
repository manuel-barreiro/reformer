import React from "react"
import { cn } from "@/lib/utils"

interface HeaderToggleProps {
  title: string
  filterOptions?: string[]
  currentFilter: string
  onFilterChange?: (filter: string) => void
}

export default function HeaderToggle({
  title,
  filterOptions,
  currentFilter,
  onFilterChange,
}: HeaderToggleProps) {
  return (
    <div className="flex w-full items-center justify-around border-b border-grey_pebble pb-6 font-dm_sans font-medium uppercase">
      <h1 className="py-2 text-xl">{title}</h1>

      {filterOptions && onFilterChange && (
        <div className="flex items-center rounded-full bg-pearlVariant">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => onFilterChange(option)}
              className={cn(
                "rounded-full px-12 py-2 text-grey_pebble",
                currentFilter === option && "bg-grey_pebble text-pearl"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
