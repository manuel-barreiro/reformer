"use client"
import ReformerCalendar from "@/components/modules/roles/common/calendario/ReformerCalendar"
import ClassesSchedule from "@/components/modules/roles/common/calendario/ClassesSchedule"
import { Booking, Class } from "@prisma/client"
import { useClassesData } from "@/components/modules/roles/common/calendario/useClassesData"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"

interface ClientCalendarPageProps {
  initialDate: Date
  initialClasses: (Class & { bookings: Booking[] })[]
  userRole: string
  userBookings: BookingWithClass[]
}

export interface ClassWithBookings extends Class {
  bookings: Booking[]
}

const ClientCalendarPage = ({
  initialDate,
  initialClasses,
  userRole,
  userBookings,
}: ClientCalendarPageProps) => {
  const {
    currentDate,
    currentMonthClasses,
    currentMonthBookings,
    selectedDayClasses,
    isLoading,
    handleDateChange,
    refreshData,
  } = useClassesData(initialDate, initialClasses, userBookings, userRole)

  return (
    <div className="flex flex-col justify-items-stretch gap-10 md:flex-row md:pl-10">
      <ReformerCalendar
        date={currentDate}
        onDateChange={handleDateChange}
        monthClasses={currentMonthClasses}
        monthBookings={currentMonthBookings}
        userRole={userRole}
      />
      <ClassesSchedule
        date={currentDate}
        classes={selectedDayClasses}
        isLoading={isLoading}
        onClassChange={refreshData}
        userRole={userRole}
      />
    </div>
  )
}

export default ClientCalendarPage
