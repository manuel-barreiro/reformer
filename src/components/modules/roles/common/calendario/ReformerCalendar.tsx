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

  // Available class days for both users and admin
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

  // User's booked class days
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

  const fromMonth = userRole === "admin" ? undefined : startOfMonth(today)
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
        className={`relative h-full w-full rounded-md ${
          isSelected
            ? "bg-grey_pebble text-pearl"
            : (isBookedClass && isSelectedMonth) ||
                (userRole === "admin" && isAvailableClass)
              ? "!bg-rust/80 text-pearl"
              : ""
        } ${userRole === "admin" && isPastDay ? "opacity-40" : ""}`}
      >
        <span
          className={`absolute inset-0 flex items-center justify-center ${isPastDay && "line-through"}`}
        >
          {dayDate.getDate()}
        </span>
        {isSelected && (
          <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-pearl"></span>
        )}
        {/* Show dot for available classes for users */}
        {userRole !== "admin" &&
          isAvailableClass &&
          !isBookedClass &&
          !isSelected &&
          isSelectedMonth &&
          !isPastDay && (
            <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-grey_pebble"></span>
          )}
      </div>
    )
  }

  const handleMonthChange = (increment: number) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + increment)

    if (userRole === "admin") {
      if (increment > 0 && isAfter(startOfMonth(newMonth), addMonths(today, 3)))
        return
    } else {
      if (increment > 0 && isAfter(startOfMonth(newMonth), addMonths(today, 1)))
        return
      if (increment < 0 && isBefore(endOfMonth(newMonth), today)) return
    }

    setCurrentMonth(newMonth)
    onDateChange(newMonth)
  }

  const canNavigateNext =
    userRole === "admin"
      ? !isAfter(startOfMonth(currentMonth), addMonths(today, 2))
      : !isAfter(startOfMonth(currentMonth), addMonths(today, 0))

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
      className="p-0 md:border-r-[1px] md:border-grey_pebble md:pr-10"
      classNames={{
        months: "space-y-4",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center",
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
        day_disabled: "opacity-50 cursor-not-allowed bg-pearlVariant",
      }}
      components={{
        Caption: ({ displayMonth }: CaptionProps) => (
          <div className="mb-4 flex items-center gap-2 text-grey_pebble sm:justify-between">
            <p className="font-dm_sans text-2xl font-medium">
              <span className="font-semibold capitalize">
                {displayMonth.toLocaleString("es-ES", { month: "long" })}{" "}
              </span>
              {displayMonth.getFullYear()}
            </p>
            <nav className="flex space-x-2">
              <Button
                variant="outline"
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                onClick={() => handleMonthChange(-1)}
                disabled={!canNavigatePrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
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
