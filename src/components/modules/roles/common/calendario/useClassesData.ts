import { useCallback, useState, useMemo, useRef } from "react"
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
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/ClientCalendarPage"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"
import { getUserBookingsInRange } from "@/actions/booking-actions"

interface ClassesCache {
  [key: string]: ClassWithBookings[]
}

const TIMEZONE = "America/Argentina/Buenos_Aires"

export function useClassesData(
  initialDate: Date,
  initialClasses: ClassWithBookings[],
  userBookings: BookingWithClass[] = [],
  userRole: string
) {
  const [bookings, setBookings] = useState<BookingWithClass[]>(userBookings)
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

  const fetchClasses = useCallback(
    async (date: Date) => {
      setIsLoading(true)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`

      try {
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

        // Fetch user bookings for the month only if the user is not an admin
        if (userRole !== "admin") {
          const newBookings = await getUserBookingsInRange(monthStart, monthEnd)
          setBookings(newBookings)
        } else {
          // Clear bookings for admin users
          setBookings([])
        }
      } catch (error) {
        console.error("Error fetching classes or bookings:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [userRole]
  )

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
    currentMonthBookings: bookings,
    selectedDayClasses,
    isLoading,
    handleDateChange,
    refreshData,
  }
}
