"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import { ClassFormDialog } from "@/components/modules/roles/admin/calendario/ClassFormDialog"
import { deleteClass } from "@/actions/class"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import ClassCard from "@/components/modules/roles/common/calendario/ClassCard"

interface ClassesScheduleProps {
  date: Date
  classes: ClassWithBookings[]
  isLoading: boolean
  onClassChange: () => void
  userRole: string
}

export default function ClassesSchedule({
  date,
  classes,
  isLoading,
  onClassChange,
  userRole,
}: ClassesScheduleProps) {
  const [timeOfDay, setTimeOfDay] = useState("AM")
  const [category, setCategory] = useState("PILATES")

  const filteredClasses = Array.isArray(classes)
    ? classes.filter((class_) => {
        const hour = new Date(class_.startTime).getHours()
        const isAM = hour < 12
        const matchesTime = timeOfDay === "AM" ? isAM : !isAM
        const matchesCategory = class_.category === category
        return matchesTime && matchesCategory
      })
    : []

  const handleDeleteClass = async (classId: string) => {
    try {
      const result = await deleteClass(classId)
      if (result.success) {
        toast({
          title: "Class deleted",
          description: "The class has been deleted successfully.",
          variant: "reformer",
        })
        await onClassChange() // Refetch classes after deletion
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete class. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex w-full flex-col justify-between gap-4 text-grey_pebble">
      <div className="flex flex-col gap-3">
        <div className="flex h-full items-center justify-between gap-5 font-dm_sans">
          <div className="flex items-baseline gap-2 text-xl">
            <span className="font-semibold capitalize">
              {date?.toLocaleDateString("es-ES", {
                weekday: "long",
              })}
            </span>
            <span className="">
              {date?.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "numeric",
              })}
            </span>
          </div>
          <Tabs
            value={timeOfDay}
            onValueChange={setTimeOfDay}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="AM">AM</TabsTrigger>
              <TabsTrigger value="PM">PM</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="PILATES">Pilates</TabsTrigger>
            <TabsTrigger value="YOGA">Yoga</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="w-full overflow-y-auto pr-4 md:h-96">
        <div className="space-y-2 py-5">
          {isLoading ? (
            Array(3)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-24 w-full rounded-lg bg-pearlVariant"
                />
              ))
          ) : filteredClasses.length === 0 ? (
            <div className="my-auto text-center text-gray-500">
              No se encontraron resultados.
            </div>
          ) : (
            filteredClasses.map((class_) => (
              <ClassCard
                key={class_.id}
                date={date}
                class_={class_}
                onClassChange={onClassChange}
                handleDeleteClass={handleDeleteClass}
                userRole={userRole}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {userRole === "admin" && (
        <ClassFormDialog
          selectedDate={date}
          onSuccess={onClassChange}
          trigger={
            <Button className="mt-6 w-full bg-[#8B4513] hover:bg-[#723A0F]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Clase
            </Button>
          }
        />
      )}
    </div>
  )
}
