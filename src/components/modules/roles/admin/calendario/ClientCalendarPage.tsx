"use client"
import ReformerCalendar from "./ReformerCalendar"
import ClassesSchedule from "./ClassesSchedule"
import { Booking, Class } from "@prisma/client"
import { useClassesData } from "@/components/modules/roles/admin/calendario/useClassesData"

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
  const {
    currentDate,
    currentMonthClasses,
    selectedDayClasses,
    isLoading,
    handleDateChange,
    refreshData,
  } = useClassesData(initialDate, initialClasses)

  return (
    <div className="flex flex-col justify-items-stretch gap-10 md:flex-row md:pl-10">
      <ReformerCalendar
        date={currentDate}
        onDateChange={handleDateChange}
        monthClasses={currentMonthClasses}
      />
      <ClassesSchedule
        date={currentDate}
        classes={selectedDayClasses}
        isLoading={isLoading}
        onClassChange={refreshData}
      />
    </div>
  )
}

export default ClientCalendarPage
