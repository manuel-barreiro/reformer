"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Edit,
  EditIcon,
  MoreVertical,
  PlusCircle,
  TrashIcon,
} from "lucide-react"
import { ClassFormDialog } from "@/components/modules/roles/admin/calendario/ClassFormDialog"
import { deleteClass } from "@/actions/class"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { ClassWithBookings } from "./useClassesData"

interface ClassesScheduleProps {
  date: Date
  classes: ClassWithBookings[]
  isLoading: boolean
  onClassChange: () => void
}

export default function ClassesSchedule({
  date,
  classes,
  isLoading,
  onClassChange,
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

  // if (isLoading) {
  //   return (
  //     <div className="flex h-full w-full items-center justify-center">
  //       <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex h-full w-full flex-col gap-4 text-grey_pebble">
      <div className="flex items-center justify-between gap-5 font-dm_sans">
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
        <Tabs value={timeOfDay} onValueChange={setTimeOfDay} className="w-full">
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

      <div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900" />
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center text-gray-500">
              No classes scheduled for this time period.
            </div>
          ) : (
            filteredClasses.map((class_) => (
              <Card key={class_.id} className="border bg-pearlVariant p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-dm_sans font-semibold text-grey_pebble">
                      {class_.category} - {class_.type.replace("_", " ")}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {new Date(class_.startTime).toLocaleTimeString(
                          "es-ES",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(class_.endTime).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <span>CUPOS</span>
                        <span>
                          {class_.bookings.length}/{class_.maxCapacity}
                        </span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Instructor: {class_.instructor}
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteClass(class_.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-midnight" />
                    </Button>
                    <ClassFormDialog
                      selectedDate={date}
                      classToEdit={class_}
                      onSuccess={onClassChange}
                      trigger={
                        <Button variant="ghost">
                          <EditIcon className="h-4 w-4 text-midnight" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <ClassFormDialog
          selectedDate={date}
          onSuccess={onClassChange}
          trigger={
            <Button className="mt-6 w-full bg-[#8B4513] hover:bg-[#723A0F]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          }
        />
      </div>
    </div>
  )
}
