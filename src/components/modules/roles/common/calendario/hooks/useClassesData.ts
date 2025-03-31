import { useCallback, useState, useMemo } from "react"
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
import { useQuery, useQueryClient } from "@tanstack/react-query"

const TIMEZONE = "America/Argentina/Buenos_Aires"

export function useClassesData(
  initialDate: Date,
  initialClasses: ClassWithBookings[],
  userBookings: BookingWithClass[] = [],
  userRole: string
) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const queryClient = useQueryClient()

  const parseDate = (date: Date | string): Date => {
    if (date instanceof Date) {
      return utcToLocal(date)
    }
    const parsedDate = parseISO(date)
    return isValid(parsedDate) ? utcToLocal(parsedDate) : utcToLocal(new Date())
  }

  // Process initial data to ensure correct date formatting
  const processedInitialClasses = useMemo(() => {
    return initialClasses.map((cls) => ({
      ...cls,
      date: parseDate(cls.date),
      startTime: parseDate(cls.startTime),
      endTime: parseDate(cls.endTime),
    }))
  }, [initialClasses])

  // Create month range parameters for queries
  const monthRange = useMemo(() => {
    const monthStart = localToUTC(
      format(startOfMonth(currentDate), "yyyy-MM-dd"),
      "00:00"
    )
    const monthEnd = localToUTC(
      format(endOfMonth(currentDate), "yyyy-MM-dd"),
      "23:59"
    )
    return { monthStart, monthEnd, monthKey: format(currentDate, "yyyy-MM") }
  }, [currentDate])

  // Query for classes data
  const { data: classes = [], isLoading: isClassesLoading } = useQuery({
    queryKey: ["classes", monthRange.monthKey],
    queryFn: async () => {
      const newClasses = await getClasses(
        monthRange.monthStart,
        monthRange.monthEnd
      )

      return newClasses.map((cls) => ({
        ...cls,
        date: parseDate(cls.date),
        startTime: parseDate(cls.startTime),
        endTime: parseDate(cls.endTime),
        category: cls.category,
        subcategory: cls.subcategory,
      }))
    },
    initialData:
      monthRange.monthKey === format(initialDate, "yyyy-MM")
        ? processedInitialClasses
        : undefined, // Only use initial data for the initial month
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  })

  // Query for user bookings (only fetch if not admin)
  const { data: bookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ["bookings", monthRange.monthKey],
    queryFn: async () => {
      return await getUserBookingsInRange(
        monthRange.monthStart,
        monthRange.monthEnd
      )
    },
    initialData:
      monthRange.monthKey === format(initialDate, "yyyy-MM")
        ? userBookings
        : undefined, // Only use initial data for the initial month
    enabled: userRole !== "admin", // Only run if not admin
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const isLoading =
    isClassesLoading || (isBookingsLoading && userRole !== "admin")

  // Filter classes for the selected day
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

  // Handle date change
  const handleDateChange = useCallback(
    (newDate: Date) => {
      const newMonth = format(newDate, "yyyy-MM")
      const currentMonth = format(currentDate, "yyyy-MM")

      setCurrentDate(newDate)

      // If the month has changed, force refetch data for the new month
      if (newMonth !== currentMonth) {
        // Invalidate and refetch for the new month
        queryClient.invalidateQueries({
          queryKey: ["classes", newMonth],
        })

        if (userRole !== "admin") {
          queryClient.invalidateQueries({
            queryKey: ["bookings", newMonth],
          })
        }
      }
    },
    [currentDate, queryClient, userRole]
  )

  // Update a specific class's bookings in the cache
  const updateClassBookings = useCallback(
    (classId: string, updatedBookings: any[]) => {
      queryClient.setQueryData(
        ["classes", monthRange.monthKey],
        (oldData: ClassWithBookings[] | undefined) => {
          if (!oldData) return classes
          return oldData.map((cls) =>
            cls.id === classId ? { ...cls, bookings: updatedBookings } : cls
          )
        }
      )
    },
    [queryClient, monthRange.monthKey, classes]
  )

  // Refresh data manually
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["classes", monthRange.monthKey],
    })

    if (userRole !== "admin") {
      queryClient.invalidateQueries({
        queryKey: ["bookings", monthRange.monthKey],
      })
    }
  }, [queryClient, monthRange.monthKey, userRole])

  return {
    currentDate,
    currentMonthClasses: classes,
    currentMonthBookings: bookings,
    selectedDayClasses,
    isLoading,
    handleDateChange,
    refreshData,
    updateClassBookings,
  }
}
