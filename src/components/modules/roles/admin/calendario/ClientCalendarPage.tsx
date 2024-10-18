"use client"

import { useState } from "react"
import ReformerCalendar from "./ReformerCalendar"
import ClassesSchedule from "./ClassesSchedule"
import { Class } from "./mockClasses"
import { Separator } from "@/components/ui/separator"

interface ClientCalendarPageProps {
  initialDate: Date
  initialClasses: Class[]
}

const ClientCalendarPage = ({
  initialDate,
  initialClasses,
}: ClientCalendarPageProps) => {
  const [date, setDate] = useState<Date>(initialDate)
  const [classes, setClasses] = useState<Class[]>(initialClasses)

  const handleDateChange = async (newDate: Date) => {
    setDate(newDate)
    // Fetch new classes for the selected date
    // const newClasses = await fetchClasses(newDate)
    setClasses(initialClasses)
  }

  return (
    <div className="flex min-h-[86dvh] flex-col items-start justify-between gap-8 p-6 lg:flex-row">
      <ReformerCalendar date={date} onDateChange={handleDateChange} />
      <ClassesSchedule date={date} classes={classes} />
    </div>
  )
}

export default ClientCalendarPage
