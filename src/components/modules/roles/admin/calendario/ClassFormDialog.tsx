"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Class } from "@prisma/client"
import { createClass, updateClass } from "@/actions/class"
import { parse, set } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import React from "react"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import { TimeInput } from "@/components/modules/roles/common/TimeInput"
import { NumberInput } from "@/components/modules/roles/common/NumberInput"

const yogaTypes = ["VINYASA", "HATHA", "BALANCE"]
const pilatesTypes = ["STRENGTH_CORE", "LOWER_BODY", "FULL_BODY"]

const formSchema = z.object({
  category: z.enum(["YOGA", "PILATES"]),
  type: z.enum([
    "VINYASA",
    "HATHA",
    "BALANCE",
    "STRENGTH_CORE",
    "LOWER_BODY",
    "FULL_BODY",
  ]),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  instructor: z.string().min(1, "Instructor is required"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1"),
})

type FormValues = z.infer<typeof formSchema>

interface ClassFormDialogProps {
  selectedDate: Date
  classToEdit?: ClassWithBookings
  onSuccess: () => void
  trigger: React.ReactNode
  currentFilters?: {
    timeOfDay: string
    category: string
  }
}

export const ClassFormDialog = React.forwardRef<
  HTMLDivElement,
  ClassFormDialogProps
>(({ selectedDate, classToEdit, trigger, onSuccess, currentFilters }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getDefaultCategory = (): "YOGA" | "PILATES" => {
    if (
      currentFilters?.category === "YOGA" ||
      currentFilters?.category === "PILATES"
    ) {
      return currentFilters.category
    }
    return "YOGA" // Default to YOGA if category is not set or invalid
  }

  const getDefaultType = (
    category: "YOGA" | "PILATES"
  ):
    | "VINYASA"
    | "STRENGTH_CORE"
    | "HATHA"
    | "BALANCE"
    | "LOWER_BODY"
    | "FULL_BODY" => {
    if (category === "YOGA") return "VINYASA"
    return "STRENGTH_CORE"
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: classToEdit
      ? {
          category: classToEdit.category,
          type: classToEdit.type,
          date: classToEdit.date.toISOString().split("T")[0],
          startTime: new Date(classToEdit.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          endTime: new Date(classToEdit.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          instructor: classToEdit.instructor,
          maxCapacity: classToEdit.maxCapacity,
        }
      : {
          category: getDefaultCategory(),
          type: getDefaultType(getDefaultCategory()),
          date: selectedDate.toISOString().split("T")[0],
          startTime: currentFilters?.timeOfDay === "AM" ? "09:00" : "13:00",
          endTime: currentFilters?.timeOfDay === "AM" ? "10:00" : "14:00",
          instructor: "",
          maxCapacity: 8,
        },
  })

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const dateStr = values.date
    const startTimeStr = values.startTime
    const endTimeStr = values.endTime

    const [startHours, startMinutes] = startTimeStr.split(":").map(Number)
    const [endHours, endMinutes] = endTimeStr.split(":").map(Number)

    // Create date in local timezone
    const date = parse(dateStr, "yyyy-MM-dd", new Date())

    // Set times in local timezone
    let startTime = set(date, { hours: startHours, minutes: startMinutes })
    let endTime = set(date, { hours: endHours, minutes: endMinutes })

    // Ensure dates are in the correct timezone
    const timeZone = "America/Argentina/Buenos_Aires"
    const zonedDate = toZonedTime(date, timeZone)
    startTime = toZonedTime(startTime, timeZone)
    endTime = toZonedTime(endTime, timeZone)

    const classData = {
      ...values,
      date: zonedDate,
      startTime,
      endTime,
      maxCapacity: Number(values.maxCapacity),
    }

    try {
      if (classToEdit) {
        await updateClass(classToEdit.id, classData)
      } else {
        await createClass(classData)
      }
      setIsOpen(false)
      onSuccess() // This will trigger a refresh of the data
      toast({
        title: classToEdit ? "Class updated" : "Class created",
        description: `The class has been ${classToEdit ? "updated" : "created"} successfully.`,
        variant: "reformer",
      })
    } catch (error) {
      console.error("Error submitting class:", error)
      toast({
        title: "Error",
        description: `Failed to ${classToEdit ? "update" : "create"} class. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = form.watch("category")

  useEffect(() => {
    if (isOpen) {
      form.reset(
        classToEdit
          ? {
              category: classToEdit.category,
              type: classToEdit.type,
              date: classToEdit.date.toISOString().split("T")[0],
              startTime: new Date(classToEdit.startTime).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              ),
              endTime: new Date(classToEdit.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              instructor: classToEdit.instructor,
              maxCapacity: classToEdit.maxCapacity,
            }
          : {
              category: getDefaultCategory(),
              type: getDefaultType(getDefaultCategory()),
              date: selectedDate.toISOString().split("T")[0],
              startTime: currentFilters?.timeOfDay === "AM" ? "09:00" : "13:00",
              endTime: currentFilters?.timeOfDay === "AM" ? "10:00" : "14:00",
              instructor: "",
              maxCapacity: 8,
            }
      )
    }
  }, [isOpen, classToEdit, selectedDate, form, currentFilters])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>{classToEdit ? "Editar Clase" : "Crear Nueva Clase"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {classToEdit ? "Editar Clase" : "Crear Nueva Clase"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-grey_pebble text-pearl">
                      <SelectItem
                        className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
                        value="YOGA"
                      >
                        Yoga
                      </SelectItem>
                      <SelectItem
                        className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
                        value="PILATES"
                      >
                        Pilates
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-grey_pebble text-pearl">
                      {selectedCategory === "YOGA"
                        ? yogaTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
                            >
                              {type.replace("_", " ")}
                            </SelectItem>
                          ))
                        : pilatesTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
                            >
                              {type.replace("_", " ")}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
                      disabled={classToEdit ? false : true}
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comienzo</FormLabel>
                    <FormControl>
                      <TimeInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finalización</FormLabel>
                    <FormControl>
                      <TimeInput
                        {...field}
                        isEndTime
                        startTime={form.watch("startTime")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Capacity</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      min={classToEdit ? classToEdit.bookings.length : 1}
                      max={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-rust py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust/90"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Procesando..."
                : classToEdit
                  ? "Editar Clase"
                  : "Crear Clase"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
