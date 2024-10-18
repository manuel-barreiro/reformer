"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import React from "react"
import { Class } from "./mockClasses"

interface ClassesScheduleProps {
  date: Date
  classes: Class[]
}

export default function ClassesSchedule({
  date,
  classes,
}: ClassesScheduleProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4 border-l-[1px] border-grey_pebble px-10 text-grey_pebble">
      <div className="flex items-center gap-5 font-dm_sans">
        <div className="flex items-baseline gap-2 text-xl">
          <span className="font-semibold capitalize">
            {date?.toLocaleDateString("es-ES", {
              weekday: "short",
            })}
          </span>
          <span>
            {date?.toLocaleDateString("es-ES", {
              day: "numeric",
            })}
          </span>
        </div>
        <Tabs defaultValue="AM" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="AM">AM</TabsTrigger>
            <TabsTrigger value="PM">PM</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs defaultValue="pilates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pilates">Pilates</TabsTrigger>
          <TabsTrigger value="yoga">Yoga</TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        {/* Class List */}
        <div className="space-y-4">
          {classes.map((clase) => (
            <Card key={clase.id} className="border bg-pearlVariant p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-dm_sans font-semibold text-grey_pebble">
                    {clase.category} - {clase.type}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>CUPOS</span>
                    <span>{clase.bookings.length}/8</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Class Button */}
        <Button className="mt-6 w-full bg-[#8B4513] hover:bg-[#723A0F]">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Clase
        </Button>
      </div>
    </div>
  )
}
