"use client"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export const NumberInput = ({
  value,
  onChange,
  min = 1,
  max = 100,
}: NumberInputProps) => {
  const increment = () => {
    if (value < max) onChange(value + 1)
  }

  const decrement = () => {
    if (value > min) onChange(value - 1)
  }

  return (
    <div className="flex w-auto items-center justify-center">
      <Button
        type="button"
        onClick={decrement}
        variant="outline"
        className="h-auto rounded-full bg-rust p-1 hover:bg-rust/80"
      >
        <Minus className="h-4 w-4 text-pearl md:h-5 md:w-5" />
      </Button>
      <span className="mx-2 w-8 text-center text-xl font-bold">{value}</span>
      <Button
        type="button"
        onClick={increment}
        variant="outline"
        className="h-auto rounded-full bg-rust p-1 hover:bg-rust/80"
      >
        <Plus className="h-4 w-4 text-pearl md:h-5 md:w-5" />
      </Button>
    </div>
  )
}
