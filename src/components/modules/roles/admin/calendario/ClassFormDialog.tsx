"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogFormContainer,
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
import { parse, set, addWeeks, isAfter } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import React from "react"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import { TimeInput } from "@/components/modules/roles/common/TimeInput"
import { NumberInput } from "@/components/modules/roles/common/NumberInput"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
  repeatEnabled: z.boolean().default(false),
  repeatWeeks: z.number().min(1).max(12).optional(),
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
  const [repeatEnabled, setRepeatEnabled] = useState(false)
  const [repeatWeeks, setRepeatWeeks] = useState(4)

  const getDefaultCategory = (): "YOGA" | "PILATES" => {
    if (
      currentFilters?.category === "YOGA" ||
      currentFilters?.category === "PILATES"
    ) {
      return currentFilters.category
    }
    return "YOGA"
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
          repeatEnabled: false,
          repeatWeeks: 4,
        }
      : {
          category: getDefaultCategory(),
          type: getDefaultType(getDefaultCategory()),
          date: selectedDate.toISOString().split("T")[0],
          startTime: currentFilters?.timeOfDay === "AM" ? "09:00" : "13:00",
          endTime: currentFilters?.timeOfDay === "AM" ? "10:00" : "14:00",
          instructor: "",
          maxCapacity: 8,
          repeatEnabled: false,
          repeatWeeks: 4,
        },
  })

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const timeZone = "America/Argentina/Buenos_Aires"

    try {
      if (classToEdit) {
        // Handle single class update
        const dateStr = values.date
        const startTimeStr = values.startTime
        const endTimeStr = values.endTime
        const [startHours, startMinutes] = startTimeStr.split(":").map(Number)
        const [endHours, endMinutes] = endTimeStr.split(":").map(Number)

        const date = parse(dateStr, "yyyy-MM-dd", new Date())
        let startTime = set(date, { hours: startHours, minutes: startMinutes })
        let endTime = set(date, { hours: endHours, minutes: endMinutes })

        startTime = toZonedTime(startTime, timeZone)
        endTime = toZonedTime(endTime, timeZone)

        const classData = {
          ...values,
          date: toZonedTime(date, timeZone),
          startTime,
          endTime,
          maxCapacity: Number(values.maxCapacity),
        }

        await updateClass(classToEdit.id, classData)
      } else {
        // Handle creation of one or multiple classes
        const baseDate = parse(values.date, "yyyy-MM-dd", new Date())
        const [startHours, startMinutes] = values.startTime
          .split(":")
          .map(Number)
        const [endHours, endMinutes] = values.endTime.split(":").map(Number)

        // Calculate number of weeks to repeat
        const numberOfWeeks = values.repeatEnabled ? values.repeatWeeks || 1 : 1

        // Create array of dates for all instances
        const dates: Date[] = []
        for (let i = 0; i < numberOfWeeks; i++) {
          const currentDate = addWeeks(baseDate, i)
          // Don't schedule classes more than 3 months in advance
          if (isAfter(currentDate, addWeeks(new Date(), 12))) break
          dates.push(currentDate)
        }

        console.log("Creating classes for dates:", dates)

        // Create all class instances
        for (const date of dates) {
          let startTime = set(date, {
            hours: startHours,
            minutes: startMinutes,
          })
          let endTime = set(date, { hours: endHours, minutes: endMinutes })

          startTime = toZonedTime(startTime, timeZone)
          endTime = toZonedTime(endTime, timeZone)

          const classData = {
            category: values.category,
            type: values.type,
            date: toZonedTime(date, timeZone),
            startTime,
            endTime,
            instructor: values.instructor,
            maxCapacity: Number(values.maxCapacity),
          }

          await createClass(classData)
        }
      }

      setIsOpen(false)
      onSuccess()
      toast({
        title: classToEdit ? "Class updated" : "Classes created",
        description: classToEdit
          ? "The class has been updated successfully."
          : values.repeatEnabled
            ? `Created ${values.repeatWeeks} weekly classes successfully.`
            : "The class has been created successfully.",
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
              repeatEnabled: false,
              repeatWeeks: 4,
            }
          : {
              category: getDefaultCategory(),
              type: getDefaultType(getDefaultCategory()),
              date: selectedDate.toISOString().split("T")[0],
              startTime: currentFilters?.timeOfDay === "AM" ? "09:00" : "13:00",
              endTime: currentFilters?.timeOfDay === "AM" ? "10:00" : "14:00",
              instructor: "",
              maxCapacity: 8,
              repeatEnabled: false,
              repeatWeeks: 4,
            }
      )
      setRepeatEnabled(false)
      setRepeatWeeks(4)
    }
  }, [isOpen, classToEdit, selectedDate, form, currentFilters])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>{classToEdit ? "Editar Clase" : "Crear Nueva Clase"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        {" "}
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
            {/* <DialogFormContainer> */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
                        disabled={true}
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
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
              name="maxCapacity"
              render={({ field }) => (
                <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border border-rust/50 bg-pearlVariant p-4">
                  <div className="w-full space-y-0.5">
                    <FormLabel>Capacidad Máxima</FormLabel>
                  </div>
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
            {!classToEdit && (
              <FormField
                control={form.control}
                name="repeatEnabled"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border border-rust/50 bg-pearlVariant p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Repetir Semanalmente</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          if (!checked) {
                            form.setValue("repeatWeeks", 4) // Reset to default when disabled
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {form.watch("repeatEnabled") && !classToEdit && (
              <FormField
                control={form.control}
                name="repeatWeeks"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border border-rust/50 bg-pearlVariant p-4">
                    <div className="w-full space-y-0.5">
                      <FormLabel>Número de semanas</FormLabel>
                    </div>
                    <FormControl>
                      <NumberInput
                        value={field.value || 4}
                        onChange={(value) => field.onChange(value)}
                        min={1}
                        max={12}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {form.watch("repeatEnabled") && !classToEdit && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="preview">
                  <AccordionTrigger className="text-sm">
                    Ver fechas programadas
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {Array.from(
                        { length: form.watch("repeatWeeks") || 0 },
                        (_, index) => {
                          const date = addWeeks(
                            parse(form.watch("date"), "yyyy-MM-dd", new Date()),
                            index
                          )
                          return (
                            <div
                              key={index}
                              className="rounded bg-pearlVariant px-2 py-1 text-sm"
                            >
                              {date.toLocaleDateString("es-AR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          )
                        }
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}{" "}
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
            {/* </DialogFormContainer> */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
