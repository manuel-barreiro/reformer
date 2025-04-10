"use client"
import React from "react"
import { cn } from "@/lib/utils"

interface HeaderToggleProps {
  title?: string
  filterOptions?: string[]
  currentFilter?: string
  onFilterChange?: (filter: string) => void
  actionButton?: React.ReactNode
}

export default function HeaderToggle({
  title,
  filterOptions,
  currentFilter,
  onFilterChange,
  actionButton,
}: HeaderToggleProps) {
  return (
    // Main container: flex-col on small screens, flex-row on medium+
    <div className="sticky top-16 z-30 flex w-full flex-col items-center gap-4 border-b border-grey_pebble bg-pearl px-4 pb-4 font-dm_sans md:flex-row md:justify-between md:gap-6 md:px-10 md:pb-6">
      {/* Action Button Container (for medium+ screens) */}
      <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:gap-4">
        {/* Action Button - Show on right on small screens, next to title on medium+ */}
        {actionButton && (
          <div className="flex w-full flex-shrink-0 items-center md:order-last">
            {actionButton}
          </div>
        )}
      </div>

      {/* Filter Options - Center alignment, takes full width on small */}
      {filterOptions && onFilterChange && (
        // Takes full width on small, auto on medium+
        <div className="flex w-full items-center justify-center md:w-auto md:justify-center">
          <div className="flex w-full flex-wrap items-center justify-between rounded-full bg-pearlVariant p-1">
            {" "}
            {/* Added padding for spacing */}
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => onFilterChange(option)}
                className={cn(
                  "flex-1 rounded-full px-3 py-1 text-[10px] font-light text-grey_pebble transition-colors duration-200 sm:px-4 sm:text-xs md:px-5 lg:text-sm", // Adjusted padding
                  currentFilter === option && "bg-grey_pebble text-pearl"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
