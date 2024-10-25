import { useCallback, useState, useMemo, useRef } from "react"
import {
  startOfMonth,
  endOfMonth,
  isSameMonth,
  parseISO,
  isValid,
  format,
} from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { getClasses } from "@/actions/class"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"
import { getUserBookingsInRange } from "@/actions/booking-actions"
import { localToUTC, utcToLocal } from "@/lib/timezone-utils"

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
    if (date instanceof Date) {
      return utcToLocal(date)
    }
    const parsedDate = parseISO(date)
    return isValid(parsedDate) ? utcToLocal(parsedDate) : utcToLocal(new Date())
  }

  const fetchClasses = useCallback(
    async (date: Date) => {
      setIsLoading(true)
      const monthKey = format(date, "yyyy-MM")

      try {
        const monthStart = localToUTC(
          format(startOfMonth(date), "yyyy-MM-dd"),
          "00:00"
        )
        const monthEnd = localToUTC(
          format(endOfMonth(date), "yyyy-MM-dd"),
          "23:59"
        )
        const newClasses = await getClasses(monthStart, monthEnd)

        const parsedClasses = newClasses.map((cls) => ({
          ...cls,
          date: parseDate(cls.date),
          startTime: parseDate(cls.startTime),
          endTime: parseDate(cls.endTime),
        }))

        setClasses(parsedClasses)
        classesCache.current[monthKey] = parsedClasses

        if (userRole !== "admin") {
          const newBookings = await getUserBookingsInRange(monthStart, monthEnd)
          setBookings(newBookings)
        } else {
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

  // New method to update a specific class's bookings
  const updateClassBookings = useCallback(
    (classId: string, updatedBookings: any[]) => {
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls.id === classId ? { ...cls, bookings: updatedBookings } : cls
        )
      )
    },
    []
  )

  const selectedDayClasses = useMemo(() => {
    return classes.filter((cls) => {
      const classDate = utcToZonedTime(new Date(cls.date), TIMEZONE)
      const currentDateInZone = utcToZonedTime(currentDate, TIMEZONE)
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
    const monthKey = format(currentDate, "yyyy-MM")
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
    updateClassBookings, // Export the new method
  }
}
