"use client"
import { useState, useEffect, useCallback } from "react"
import ReformerCalendar from "./ReformerCalendar"
import ClassesSchedule from "./ClassesSchedule"
import { Booking, Class } from "@prisma/client"
import { getClasses } from "@/actions/class"
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"

interface ClientCalendarPageProps {
  initialDate: Date
  initialClasses: (Class & { bookings: Booking[] })[]
}

export interface ClassWithBookings extends Class {
  bookings: Booking[]
}

const ClientCalendarPage = ({
  initialDate,
  initialClasses,
}: ClientCalendarPageProps) => {
  const [date, setDate] = useState<Date>(initialDate)
  const [classes, setClasses] = useState<ClassWithBookings[]>(initialClasses)
  const [monthClasses, setMonthClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchMonthClasses = useCallback(async (currentDate: Date) => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const fetchedMonthClasses = await getClasses(monthStart, monthEnd)
    setMonthClasses(fetchedMonthClasses)
  }, [])

  const fetchDayClasses = useCallback(async (currentDate: Date) => {
    setIsLoading(true)
    try {
      const dayStart = startOfDay(currentDate)
      const dayEnd = endOfDay(currentDate)
      const dayClasses = (await getClasses(
        dayStart,
        dayEnd
      )) as ClassWithBookings[]
      setClasses(dayClasses)
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMonthClasses(date)
    fetchDayClasses(date)
  }, [date, fetchMonthClasses, fetchDayClasses])

  const handleDateChange = useCallback((newDate: Date) => {
    setDate(newDate)
  }, [])

  const handleClassChange = useCallback(() => {
    fetchDayClasses(date)
    fetchMonthClasses(date)
  }, [date, fetchDayClasses, fetchMonthClasses])

  return (
    <div className="flex flex-col justify-items-stretch gap-10 md:flex-row md:pl-10">
      <ReformerCalendar
        date={date}
        onDateChange={handleDateChange}
        monthClasses={monthClasses}
      />
      <ClassesSchedule
        date={date}
        classes={classes}
        isLoading={isLoading}
        onClassChange={handleClassChange}
      />
    </div>
  )
}

export default ClientCalendarPage
