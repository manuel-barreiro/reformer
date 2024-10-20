"use client"
import { useCallback, useEffect, useState } from "react"
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
import { fromZonedTime, format } from "date-fns-tz"
import React from "react"

const timeZone = "America/Argentina/Buenos_Aires" // Argentina's time zone
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
  classToEdit?: Class
  trigger?: React.ReactNode
  onSuccess: () => void
}

export const ClassFormDialog = React.forwardRef<
  HTMLDivElement,
  ClassFormDialogProps
>(({ selectedDate, classToEdit, trigger, onSuccess }, ref) => {
  useEffect(() => {
    console.log("selectedDate in ClassFormDialog:", selectedDate)
  }, [selectedDate])
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          date: "",
          startTime: "",
          endTime: "",
          instructor: "",
          maxCapacity: 8,
        },
  })

  useEffect(() => {
    if (selectedDate && !classToEdit) {
      form.setValue("date", selectedDate.toISOString().split("T")[0])
    }
  }, [selectedDate, classToEdit, form])

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsSubmitting(true)
      const dateStr = values.date // e.g., '2024-11-16'
      const startTimeStr = values.startTime // e.g., '14:00'
      const endTimeStr = values.endTime // e.g., '15:30'

      console.log("dateStr:", dateStr)
      console.log("startTimeStr:", startTimeStr)
      console.log("endTimeStr:", endTimeStr)

      const [startHours, startMinutes] = startTimeStr.split(":").map(Number)
      const [endHours, endMinutes] = endTimeStr.split(":").map(Number)

      // Parse the date without time (local date)
      const date = parse(dateStr, "yyyy-MM-dd", new Date())

      // Set the start time with correct hours and minutes
      let startTime = set(date, { hours: startHours, minutes: startMinutes })

      // Convert to UTC using the updated 'fromZonedTime'
      startTime = fromZonedTime(startTime, timeZone)
      console.log(
        "Start time (UTC):",
        format(startTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "UTC" })
      )

      // Set the end time
      let endTime = set(date, { hours: endHours, minutes: endMinutes })

      // Convert end time to UTC using 'fromZonedTime'
      endTime = fromZonedTime(endTime, timeZone)
      console.log(
        "End time (UTC):",
        format(endTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "UTC" })
      )

      // Class data with UTC times
      const classData = {
        ...values,
        date: new Date(dateStr),
        startTime,
        endTime,
        maxCapacity: Number(values.maxCapacity),
      }

      console.log("Class data:", classData)

      try {
        let result
        if (classToEdit) {
          result = await updateClass(classToEdit.id, classData)
        } else {
          result = await createClass(classData)
        }

        if (result.success) {
          setOpen(false)
          onSuccess()
          setTimeout(() => {
            toast({
              title: classToEdit ? "Class updated" : "Class created",
              description: `The class has been ${classToEdit ? "updated" : "created"} successfully.`,
              variant: "reformer",
            })
          }, 300)
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        })
        console.error("Class operation error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [classToEdit, onSuccess]
  )

  const selectedCategory = form.watch("category")

  useEffect(() => {
    if (open) {
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
              date: selectedDate.toISOString().split("T")[0],
              startTime: "",
              endTime: "",
              instructor: "",
              maxCapacity: 8,
            }
      )
    }
  }, [open, classToEdit, selectedDate, form])

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{classToEdit ? "Edit Class" : "Add Class"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {classToEdit ? "Edit Class" : "Create New Class"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="YOGA">Yoga</SelectItem>
                      <SelectItem value="PILATES">Pilates</SelectItem>
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
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCategory === "YOGA"
                        ? yogaTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace("_", " ")}
                            </SelectItem>
                          ))
                        : pilatesTypes.map((type) => (
                            <SelectItem key={type} value={type}>
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
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                    <Input {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : classToEdit
                  ? "Update Class"
                  : "Create Class"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
