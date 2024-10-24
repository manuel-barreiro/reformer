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
import { parse, set, addWeeks, addDays, format, isAfter } from "date-fns"
import { ca, es } from "date-fns/locale"
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
import { formatLocalDate, formatLocalTime } from "@/lib/timezone-utils"

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
  repeatDaily: z.boolean().default(false),
  repeatUntil: z.string().optional(),
  repeatWeekly: z.boolean().default(false),
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

  const generateWeekDates = (startDate: Date) => {
    const dates = []
    for (let i = 1; i < 7; i++) {
      const date = addDays(startDate, i)
      dates.push({
        value: format(date, "yyyy-MM-dd"),
        label: format(date, "EEEE d/M", { locale: es }),
      })
    }
    return dates
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: classToEdit
      ? {
          category: classToEdit.category,
          type: classToEdit.type,
          date: formatLocalDate(classToEdit.date),
          startTime: formatLocalTime(classToEdit.startTime),
          endTime: formatLocalTime(classToEdit.endTime),
          instructor: classToEdit.instructor,
          maxCapacity: classToEdit.maxCapacity,
          repeatDaily: false,
          repeatUntil: undefined,
          repeatWeekly: false,
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
          repeatDaily: false,
          repeatUntil: undefined,
          repeatWeekly: false,
          repeatWeeks: 4,
        },
  })

  const weekDates = generateWeekDates(
    parse(form.watch("date"), "yyyy-MM-dd", new Date())
  )

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      if (classToEdit) {
        // Parse the date and create the date strings
        const baseDate = parse(values.date, "yyyy-MM-dd", new Date())
        const year = baseDate.getFullYear()
        const month = baseDate.getMonth()
        const day = baseDate.getDate()

        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const startTimeString = `${dateString}T${values.startTime}:00`
        const endTimeString = `${dateString}T${values.endTime}:00`

        // Create the dates
        const zonedDate = new Date(`${dateString}T00:00:00`)
        const startTime = new Date(startTimeString)
        const endTime = new Date(endTimeString)

        const result = await updateClass(classToEdit.id, {
          date: zonedDate,
          startTime,
          endTime,
          instructor: values.instructor,
          maxCapacity: values.maxCapacity,
          category: values.category,
          type: values.type,
        })

        if (result.success) {
          setIsOpen(false)
          onSuccess()
          toast({
            title: "Clase actualizada",
            description: "La clase se ha actualizado exitosamente.",
            variant: "reformer",
          })
        }
      } else {
        const result = await createClass(values)
        if (result.success) {
          setIsOpen(false)
          onSuccess()
          toast({
            title: "Clases creadas",
            description: `Se han creado ${result.count} clases exitosamente.`,
            variant: "reformer",
          })
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: `Error al ${classToEdit ? "actualizar" : "crear"} la(s) clase(s).`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = form.watch("category")
  const repeatDaily = form.watch("repeatDaily")
  const repeatWeekly = form.watch("repeatWeekly")

  // Preview calculation
  const calculatePreviewDates = () => {
    const dates: Date[] = []
    const baseDate = parse(form.watch("date"), "yyyy-MM-dd", new Date())
    const endDate =
      repeatDaily && form.watch("repeatUntil")
        ? parse(form.watch("repeatUntil") || "", "yyyy-MM-dd", new Date())
        : baseDate

    // Calculate horizontal dates (within week)
    const horizontalDates: Date[] = []
    let currentDate = baseDate
    while (currentDate <= endDate) {
      horizontalDates.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }

    // Calculate vertical dates (weeks)
    const weeks = repeatWeekly ? form.watch("repeatWeeks") || 1 : 1
    for (let week = 0; week < weeks; week++) {
      horizontalDates.forEach((date) => {
        dates.push(addWeeks(date, week))
      })
    }

    return dates
  }

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
              repeatDaily: false,
              repeatUntil: undefined,
              repeatWeekly: false,
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
              repeatDaily: false,
              repeatUntil: undefined,
              repeatWeekly: false,
              repeatWeeks: 4,
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
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
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
              <>
                {/* Horizontal Repetition */}
                <FormField
                  control={form.control}
                  name="repeatDaily"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border border-rust/50 bg-pearlVariant p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Repetir en la semana</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {repeatDaily && (
                  <FormField
                    control={form.control}
                    name="repeatUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repetir diariamente hasta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                              <SelectValue placeholder="Seleccionar día" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-grey_pebble text-pearl">
                            {weekDates.map((date) => (
                              <SelectItem
                                key={date.value}
                                value={date.value}
                                className="border-b border-pearl/50 capitalize hover:!bg-pearlVariant3"
                              >
                                {date.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Vertical Repetition */}
                <FormField
                  control={form.control}
                  name="repeatWeekly"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border border-rust/50 bg-pearlVariant p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Repetir semanalmente</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            if (!checked) {
                              form.setValue("repeatWeeks", 4)
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {repeatWeekly && (
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

                {/* Preview Section */}
                {(repeatDaily || repeatWeekly) && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="preview">
                      <AccordionTrigger className="text-sm">
                        Ver fechas programadas
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {calculatePreviewDates().map((date, index) => (
                            <div
                              key={index}
                              className="rounded bg-pearlVariant px-2 py-1 text-sm"
                            >
                              {date.toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </>
            )}

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
