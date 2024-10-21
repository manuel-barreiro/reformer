import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()

  return (
    <>
      <div className="flex w-full items-center justify-between border-b border-grey_pebble pb-4 font-dm_sans text-xs font-medium uppercase sm:text-sm md:justify-between md:pb-6 md:pl-10 lg:flex-row lg:text-lg">
        <div className="flex items-center gap-4">
          <h1 className="hidden py-2 lg:block">{title}</h1>
          <Link
            href={
              pathname === "/paquetes"
                ? "/checkout"
                : pathname === "/reservas"
                  ? "/calendario"
                  : ""
            }
          >
            <Button className="h-auto rounded-full bg-rust p-1 hover:bg-rust/80">
              <PlusIcon className="h-4 w-4 text-pearl md:h-7 md:w-7" />
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
