"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Class } from "@prisma/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { useState, useMemo } from "react"
import { CaptionProps } from "react-day-picker"
import {
  format,
  isValid,
  isBefore,
  isAfter,
  addMonths,
  startOfDay,
  endOfMonth,
  startOfMonth,
} from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"

interface ReformerCalendarProps {
  date: Date
  onDateChange: (date: Date) => void
  monthClasses: Class[]
  monthBookings: BookingWithClass[]
  userRole: string
}

export default function ReformerCalendar({
  date,
  onDateChange,
  monthClasses,
  monthBookings,
  userRole,
}: ReformerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(date)
  const today = startOfDay(new Date())

  // Available class days logic remains the same
  const availableClassDays = useMemo(
    () =>
      new Set(
        monthClasses
          .filter((item) => userRole === "admin" || item.isActive)
          .map((item) => {
            const itemDate = new Date(item.date)
            const localDate = utcToZonedTime(
              itemDate,
              "America/Argentina/Buenos_Aires"
            )
            return isValid(itemDate) ? format(localDate, "yyyy-MM-dd") : null
          })
          .filter(Boolean)
      ),
    [monthClasses]
  )

  // Booked class days logic remains the same
  const bookedClassDays = useMemo(
    () =>
      new Set(
        monthBookings
          .map((booking) => {
            const itemDate = new Date(booking.class.date)
            const localDate = utcToZonedTime(
              itemDate,
              "America/Argentina/Buenos_Aires"
            )
            return isValid(itemDate) ? format(localDate, "yyyy-MM-dd") : null
          })
          .filter(Boolean)
      ),
    [monthBookings]
  )

  const lastAvailableDate = useMemo(() => {
    if (userRole === "admin") {
      return endOfMonth(addMonths(today, 3))
    }
    return endOfMonth(addMonths(today, 1))
  }, [userRole, today])

  const disabledDays = useMemo(() => {
    if (userRole === "admin") {
      return undefined
    }
    return [
      {
        before: today,
        after: lastAvailableDate,
      },
    ]
  }, [userRole, lastAvailableDate, today])

  const fromMonth = userRole === "admin" ? undefined : today
  const toMonth = lastAvailableDate

  const CustomDay = ({
    date: dayDate,
    displayMonth,
  }: {
    date: Date
    displayMonth: Date
  }) => {
    const dateStr = format(dayDate, "yyyy-MM-dd")
    const isAvailableClass = availableClassDays.has(dateStr)
    const isBookedClass = bookedClassDays.has(dateStr)
    const isSelectedMonth = dayDate.getMonth() === displayMonth.getMonth()
    const isSelected = dayDate.toDateString() === date.toDateString()
    const isPastDay = isBefore(dayDate, today)

    return (
      <div
        className={`group relative flex aspect-square w-full items-center justify-center rounded-md transition-all duration-200 ${
          isSelected
            ? "bg-grey_pebble text-pearl"
            : (isBookedClass && isSelectedMonth) ||
                (userRole === "admin" && isAvailableClass)
              ? "!bg-rust/80 text-pearl"
              : "hover:bg-pearlVariant3"
        } ${userRole === "admin" && isPastDay ? "opacity-40" : ""}`}
      >
        <span
          className={`text-center text-sm font-normal sm:text-base ${
            isPastDay ? "line-through" : ""
          }`}
        >
          {dayDate.getDate()}
        </span>
        {isSelected && (
          <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-pearl"></span>
        )}
        {userRole !== "admin" &&
          isAvailableClass &&
          !isBookedClass &&
          !isSelected &&
          isSelectedMonth &&
          !isPastDay && (
            <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-grey_pebble"></span>
          )}
      </div>
    )
  }

  const handleMonthChange = (increment: number) => {
    const newMonth = addMonths(currentMonth, increment)

    // Check navigation boundaries
    if (increment > 0) {
      const maxDate =
        userRole === "admin" ? addMonths(today, 3) : addMonths(today, 1)
      if (isAfter(startOfMonth(newMonth), maxDate)) return
    } else {
      if (userRole !== "admin" && isBefore(endOfMonth(newMonth), today)) return
    }

    setCurrentMonth(newMonth)
    onDateChange(newMonth)
  }

  const canNavigateNext =
    userRole === "admin"
      ? isBefore(startOfMonth(currentMonth), addMonths(today, 3))
      : isBefore(startOfMonth(currentMonth), addMonths(today, 1))

  const canNavigatePrev =
    userRole === "admin" ? true : !isBefore(endOfMonth(currentMonth), today)

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(newDate) => newDate && onDateChange(newDate)}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      disabled={disabledDays}
      fromMonth={fromMonth}
      toMonth={toMonth}
      className="w-full p-0 lg:border-r-[1px] lg:border-grey_pebble lg:pr-10"
      classNames={{
        months: "space-y-6",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center mb-6",
        caption_label: "text-lg font-semibold text-3xl",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        table: "w-full border-collapse",
        head_row: "grid w-full grid-cols-7 gap-1",
        head_cell: "text-gray-500 font-normal text-sm text-center mb-2",
        row: "grid w-full grid-cols-7 gap-1 mb-1",
        cell: "relative p-0 text-center focus-within:relative focus-within:z-20",
        day: "aspect-square w-full p-0 font-normal hover:bg-pearlVariant3 bg-pearlVariant rounded-md",
        day_selected: "",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "opacity-50 bg-transparent",
        day_disabled: "opacity-50 cursor-not-allowed bg-pearlVariant",
      }}
      components={{
        Caption: ({ displayMonth }: CaptionProps) => (
          <div className="flex items-center justify-between text-grey_pebble">
            <p className="font-dm_sans text-xl font-medium sm:text-2xl">
              <span className="font-semibold capitalize">
                {displayMonth.toLocaleString("es-ES", { month: "long" })}{" "}
              </span>
              {displayMonth.getFullYear()}
            </p>
            <nav className="flex space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
                onClick={() => handleMonthChange(-1)}
                disabled={!canNavigatePrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
                onClick={() => handleMonthChange(1)}
                disabled={!canNavigateNext}
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
