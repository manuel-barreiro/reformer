"use client"
import React, { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  isEndTime?: boolean
  startTime?: string
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  isEndTime = false,
  startTime = "",
}) => {
  const [hours, setHours] = useState(value.split(":")[0] || "00")
  const [minutes, setMinutes] = useState(value.split(":")[1] || "00")

  useEffect(() => {
    onChange(`${hours}:${minutes}`)
  }, [hours, minutes, onChange])

  const generateTimeOptions = (): string[] => {
    const options: string[] = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
        if (!isEndTime || time > startTime) {
          options.push(time)
        }
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  return (
    <Select
      value={`${hours}:${minutes}`}
      onValueChange={(newValue: string) => {
        const [newHours, newMinutes] = newValue.split(":")
        setHours(newHours)
        setMinutes(newMinutes)
      }}
    >
      <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-40 bg-grey_pebble text-pearl">
        {timeOptions.map((time) => (
          <SelectItem
            key={time}
            value={time}
            className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
          >
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
