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
    <div className="flex items-center">
      <Button type="button" onClick={decrement} variant="outline" size="sm">
        <Minus className="h-4 w-4" />
      </Button>
      <span className="mx-2 w-8 text-center">{value}</span>
      <Button type="button" onClick={increment} variant="outline" size="sm">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
