"use client"
import ReformerCalendar from "@/components/modules/roles/common/calendario/ReformerCalendar"
import ClassesSchedule from "@/components/modules/roles/common/calendario/ClassesSchedule"
import { Booking, Class } from "@prisma/client"
import { useClassesData } from "@/components/modules/roles/common/calendario/hooks/useClassesData"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"
import { ClassWithBookings } from "./types"

interface ClientCalendarPageProps {
  initialDate: Date
  initialClasses: ClassWithBookings[]
  userRole: string
  userBookings: BookingWithClass[]
  currentUserId?: string
}

const ClientCalendarPage = ({
  initialDate,
  initialClasses,
  userRole,
  userBookings,
  currentUserId,
}: ClientCalendarPageProps) => {
  const {
    currentDate,
    currentMonthClasses,
    currentMonthBookings,
    selectedDayClasses,
    isLoading,
    updateClassBookings,
    handleDateChange,
    refreshData,
  } = useClassesData(initialDate, initialClasses, userBookings, userRole)

  return (
    <div className="flex h-full w-full flex-col justify-items-stretch gap-10 lg:flex-row lg:pl-10">
      <ReformerCalendar
        date={currentDate}
        onDateChange={handleDateChange}
        monthClasses={currentMonthClasses}
        monthBookings={currentMonthBookings}
        userRole={userRole}
      />
      <ClassesSchedule
        currentUserId={currentUserId}
        updateClassBookings={updateClassBookings}
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
