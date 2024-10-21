import { useCallback, useState, useMemo, useRef, useEffect } from "react"
import {
  startOfMonth,
  endOfMonth,
  isSameMonth,
  parseISO,
  isValid,
  format,
} from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { getClasses } from "@/actions/class"
import { ClassWithBookings } from "@/components/modules/roles/admin/calendario/ClientCalendarPage"

interface ClassesCache {
  [key: string]: ClassWithBookings[]
}

const TIMEZONE = "America/Argentina/Buenos_Aires"

export function useClassesData(
  initialDate: Date,
  initialClasses: ClassWithBookings[]
) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [classes, setClasses] = useState<ClassWithBookings[]>(initialClasses)
  const [isLoading, setIsLoading] = useState(false)
  const classesCache = useRef<ClassesCache>({})

  const parseDate = (date: Date | string): Date => {
    const timeZone = "America/Argentina/Buenos_Aires"
    if (date instanceof Date) {
      return isValid(date)
        ? toZonedTime(date, timeZone)
        : toZonedTime(new Date(), timeZone)
    }
    const parsedDate = parseISO(date)
    return isValid(parsedDate)
      ? toZonedTime(parsedDate, timeZone)
      : toZonedTime(new Date(), timeZone)
  }

  const fetchClasses = useCallback(async (date: Date) => {
    setIsLoading(true)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`

    try {
      // Always fetch fresh data when refreshing
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      const newClasses = await getClasses(monthStart, monthEnd)

      const parsedClasses = newClasses.map((cls) => ({
        ...cls,
        date: parseDate(cls.date),
        startTime: parseDate(cls.startTime),
        endTime: parseDate(cls.endTime),
      }))

      setClasses(parsedClasses)
      classesCache.current[monthKey] = parsedClasses
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const selectedDayClasses = useMemo(() => {
    const timeZone = "America/Argentina/Buenos_Aires"
    return classes.filter((cls) => {
      const classDate = toZonedTime(new Date(cls.date), timeZone)
      const currentDateInZone = toZonedTime(currentDate, timeZone)
      return (
        format(classDate, "yyyy-MM-dd") ===
        format(currentDateInZone, "yyyy-MM-dd")
      )
    })
  }, [classes, currentDate])

  const handleDateChange = useCallback(
    (newDate: Date) => {
      setCurrentDate(newDate)
      if (!isSameMonth(newDate, currentDate)) {
        fetchClasses(newDate)
      }
    },
    [currentDate, fetchClasses]
  )

  const refreshData = useCallback(() => {
    // Clear the cache for the current month to force a fresh fetch
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`
    delete classesCache.current[monthKey]
    fetchClasses(currentDate)
  }, [currentDate, fetchClasses])

  return {
    currentDate,
    currentMonthClasses: classes,
    selectedDayClasses,
    isLoading,
    handleDateChange,
    refreshData,
  }
}
