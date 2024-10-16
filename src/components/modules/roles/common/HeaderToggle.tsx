import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

interface HeaderToggleProps {
  title: string
  filterOptions?: string[]
  currentFilter?: string
  onFilterChange?: (filter: string) => void
}

export default function HeaderToggle({
  title,
  filterOptions,
  currentFilter,
  onFilterChange,
}: HeaderToggleProps) {
  return (
    <>
      <div className="flex w-full items-center justify-between border-b border-grey_pebble pb-4 font-dm_sans text-xs font-medium uppercase sm:text-sm md:justify-between md:pb-6 md:pl-10 lg:text-lg">
        <div className="flex items-center gap-4">
          <h1 className="py-2">{title}</h1>
          <Link href="/checkout">
            <Button className="aspect-square rounded-full bg-rust p-1 hover:bg-rust/80">
              <PlusIcon size={24} className="text-pearl" />
            </Button>
          </Link>
        </div>

        {filterOptions && onFilterChange && (
          <div className="flex items-center rounded-full bg-pearlVariant">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => onFilterChange(option)}
                className={cn(
                  "rounded-full px-6 py-1 text-[10px] font-light text-grey_pebble sm:text-xs md:px-14 md:py-2 lg:text-sm",
                  currentFilter === option && "bg-grey_pebble text-pearl"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
