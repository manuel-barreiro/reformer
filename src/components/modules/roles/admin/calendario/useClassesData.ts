import { useState, useEffect, useCallback } from "react"
import { startOfMonth, endOfMonth, isSameMonth } from "date-fns"
import { Class, Booking } from "@prisma/client"
import { getClasses } from "@/actions/class"

export type ClassWithBookings = Class & { bookings: Booking[] }

export const useClassesData = (initialDate: Date) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate)
  const [monthClasses, setMonthClasses] = useState<ClassWithBookings[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchMonthClasses = useCallback(async (date: Date) => {
    setIsLoading(true)
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    try {
      const classes = await getClasses(monthStart, monthEnd)
      setMonthClasses(classes)
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isSameMonth(selectedDate, monthClasses[0]?.date)) {
      fetchMonthClasses(selectedDate)
    }
  }, [selectedDate, monthClasses, fetchMonthClasses])

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate)
    if (!isSameMonth(newDate, selectedDate)) {
      fetchMonthClasses(newDate)
    }
  }

  const getDayClasses = (date: Date): ClassWithBookings[] => {
    return monthClasses.filter(
      (cls) => cls.date.toDateString() === date.toDateString()
    )
  }

  const refreshClasses = async () => {
    fetchMonthClasses(selectedDate)
  }

  return {
    selectedDate,
    monthClasses,
    isLoading,
    handleDateChange,
    getDayClasses,
    refreshClasses,
  }
}
