"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Class } from "@prisma/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { useState, useMemo } from "react"
import { CaptionProps } from "react-day-picker"

interface ReformerCalendarProps {
  date: Date
  onDateChange: (date: Date) => void
  monthClasses: Class[]
}

export default function ReformerCalendar({
  date,
  onDateChange,
  monthClasses,
}: ReformerCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date())

  const classDays = useMemo(() => {
    const days = new Set<string>()
    monthClasses.forEach((cls) => {
      days.add(cls.date.toISOString().split("T")[0])
    })
    return days
  }, [monthClasses])

  const CustomDay = ({
    date: dayDate,
    displayMonth,
  }: {
    date: Date
    displayMonth: Date
  }) => {
    const isClassDay = classDays.has(dayDate.toISOString().split("T")[0])
    const isSelectedMonth = dayDate.getMonth() === displayMonth.getMonth()
    const isSelected = dayDate.toDateString() === date.toDateString()

    return (
      <div
        className={`relative h-full w-full rounded-md ${
          isSelected
            ? "bg-grey_pebble text-pearl"
            : isClassDay && isSelectedMonth
              ? "bg-rust/80 text-pearl"
              : ""
        }`}
      >
        <span className={`absolute inset-0 flex items-center justify-center`}>
          {dayDate.getDate()}
        </span>
        {isSelected && (
          <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-pearl"></span>
        )}
      </div>
    )
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(newDate) => newDate && onDateChange(newDate)}
      month={month}
      onMonthChange={setMonth}
      className="p-0 md:border-r-[1px] md:border-grey_pebble md:pr-10"
      classNames={{
        months: "space-y-4",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center ",
        caption_label: "text-lg font-semibold text-3xl!",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-gray-500 w-full font-normal text-sm mb-2",
        row: "flex w-full gap-1 mb-1",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: "h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:w-16 xl:h-16 p-0 hover:bg-pearlVariant3 bg-pearlVariant rounded-md",
        day_selected: "",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "opacity-50 bg-transparent",
      }}
      components={{
        Caption: ({ displayMonth }: CaptionProps) => (
          <div className="mb-4 flex items-center gap-2 text-grey_pebble sm:justify-between">
            <p className="font-dm_sans text-2xl font-medium">
              <span className="font-semibold capitalize">
                {displayMonth.toLocaleString("default", { month: "long" })}{" "}
              </span>
              {displayMonth.getFullYear()}
            </p>
            <nav className="flex space-x-2">
              <Button
                variant="outline"
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                onClick={() => {
                  const prevMonth = new Date(month)
                  prevMonth.setMonth(prevMonth.getMonth() - 1)
                  setMonth(prevMonth)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                onClick={() => {
                  const nextMonth = new Date(month)
                  nextMonth.setMonth(nextMonth.getMonth() + 1)
                  setMonth(nextMonth)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        ),
        DayContent: ({ date, displayMonth }) => (
          <CustomDay date={date} displayMonth={displayMonth} />
        ),
      }}
    />
  )
}
