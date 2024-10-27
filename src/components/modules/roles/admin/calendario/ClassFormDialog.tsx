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
import { Category, Class, Subcategory } from "@prisma/client"
import { createClass, updateClass } from "@/actions/class"
import { parse, set, addWeeks, addDays, format, isAfter } from "date-fns"
import { ca, es } from "date-fns/locale"
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
import {
  formatLocalDate,
  formatLocalTime,
  localToUTC,
} from "@/lib/timezone-utils"
import { getActiveClassCategories } from "@/actions/category"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[]
}

const formSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  instructor: z.string().min(1, "Instructor is required"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1"),
  repeatDaily: z.boolean().default(false),
  repeatUntil: z.string().optional(),
  repeatWeekly: z.boolean().default(false),
  repeatWeeks: z.number().min(1).max(12).default(4),
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
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getActiveClassCategories()
      if (result.success) {
        setCategories(result?.data as CategoryWithSubcategories[])
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  // Get default category based on current filter
  const getDefaultCategory = () => {
    if (!categories.length) return ""

    if (currentFilters?.category) {
      const matchingCategory = categories.find(
        (cat) =>
          cat.name.toLowerCase() === currentFilters.category.toLowerCase()
      )
      if (matchingCategory) return matchingCategory.id
    }

    return categories[0].id
  }

  // Get default subcategory based on selected category
  const getDefaultSubcategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.subcategories[0]?.id || ""
  }

  // Get default times based on timeOfDay
  const getDefaultTimes = () => {
    const isAM = currentFilters?.timeOfDay === "AM"
    return {
      startTime: isAM ? "09:00" : "13:00",
      endTime: isAM ? "10:00" : "14:00",
    }
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
          categoryId: classToEdit.categoryId,
          subcategoryId: classToEdit.subcategoryId,
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
          repeatDaily: false,
          repeatWeekly: false,
        }
      : {
          categoryId: getDefaultCategory(),
          subcategoryId: "",
          date: format(selectedDate, "yyyy-MM-dd"),
          ...getDefaultTimes(),
          instructor: "",
          maxCapacity: 8,
          repeatDaily: false,
          repeatWeekly: false,
          repeatWeeks: 4,
        },
  })

  // Watch for category changes to update subcategories
  const selectedCategoryId = form.watch("categoryId")
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  )

  // Este efecto se ejecuta cuando cambia la categoría
  useEffect(() => {
    if (selectedCategoryId && selectedCategory) {
      // Asegurarse de que hay subcategorías disponibles
      if (selectedCategory.subcategories.length > 0) {
        // Forzar la actualización de la subcategoría al primer elemento
        form.setValue("subcategoryId", selectedCategory.subcategories[0].id, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    }
  }, [selectedCategoryId, selectedCategory, form])

  const weekDates = generateWeekDates(
    parse(form.watch("date"), "yyyy-MM-dd", new Date())
  )

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      if (classToEdit) {
        const baseDate = localToUTC(values.date, "00:00")
        const startTime = localToUTC(values.date, values.startTime)
        const endTime = localToUTC(values.date, values.endTime)

        const result = await updateClass(classToEdit.id, {
          date: baseDate,
          startTime,
          endTime,
          instructor: values.instructor,
          maxCapacity: values.maxCapacity,
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      const defaultValues = classToEdit
        ? {
            categoryId: classToEdit.categoryId,
            subcategoryId: classToEdit.subcategoryId,
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
            repeatDaily: false,
            repeatWeekly: false,
          }
        : {
            categoryId: getDefaultCategory(),
            subcategoryId: getDefaultSubcategory(getDefaultCategory()),
            date: format(selectedDate, "yyyy-MM-dd"),
            ...getDefaultTimes(),
            instructor: "",
            maxCapacity: 8,
            repeatDaily: false,
            repeatWeekly: false,
          }
      form.reset(defaultValues)
    }
  }, [isOpen, classToEdit, selectedDate, form, categories])

  // Initialize form values when dialog opens
  useEffect(() => {
    if (isOpen && !classToEdit && categories.length > 0) {
      const defaultCategory = getDefaultCategory()
      const defaultSubcategory = getDefaultSubcategory(defaultCategory)
      const defaultTimes = getDefaultTimes()

      form.reset({
        ...form.getValues(),
        categoryId: defaultCategory,
        subcategoryId: defaultSubcategory,
        startTime: defaultTimes.startTime,
        endTime: defaultTimes.endTime,
        instructor: "",
        repeatDaily: false,
        repeatWeekly: false,
      })
    }
  }, [isOpen, categories, classToEdit, form, currentFilters])

  useEffect(() => {
    if (!classToEdit && selectedDate) {
      form.setValue("date", format(selectedDate, "yyyy-MM-dd"))
    }
  }, [selectedDate, form, classToEdit])

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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-grey_pebble text-pearl">
                        {categories.map((category) => (
                          <SelectItem
                            className="border-b border-pearl/50 capitalize hover:!bg-pearlVariant3"
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
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
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={
                        field.value ||
                        (selectedCategory?.subcategories[0]?.id ?? "")
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                          <SelectValue placeholder="Seleccionar subcategoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-grey_pebble text-pearl">
                        {selectedCategory?.subcategories.map((subcategory) => (
                          <SelectItem
                            key={subcategory.id}
                            value={subcategory.id}
                            className="border-b border-pearl/50 capitalize hover:!bg-pearlVariant3"
                          >
                            {subcategory.name}
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
                            // Si se activa, asegurarse de que repeatWeeks tenga un valor
                            if (checked) {
                              form.setValue("repeatWeeks", 4, {
                                shouldValidate: true,
                              })
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
                            value={field.value ?? 4}
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
