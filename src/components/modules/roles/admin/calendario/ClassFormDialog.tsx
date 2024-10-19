import { useState } from "react"
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
  selectedDate?: Date
  classToEdit?: Class
  trigger?: React.ReactNode
  onSuccess?: () => Promise<void>
}

export function ClassFormDialog({
  selectedDate,
  classToEdit,
  trigger,
  onSuccess,
}: ClassFormDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: classToEdit
      ? {
          category: classToEdit.category,
          type: classToEdit.type,
          date: classToEdit.date.toISOString().split("T")[0],
          startTime: classToEdit.startTime.toISOString().slice(11, 16),
          endTime: classToEdit.endTime.toISOString().slice(11, 16),
          instructor: classToEdit.instructor,
          maxCapacity: Number(classToEdit.maxCapacity),
        }
      : {
          date: selectedDate?.toISOString().split("T")[0] || "",
          startTime: "",
          endTime: "",
          instructor: "",
          maxCapacity: Number(8),
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dateStr = values.date
    const startTimeStr = values.startTime
    const endTimeStr = values.endTime

    const startTime = new Date(`${dateStr}T${startTimeStr}:00`)
    const endTime = new Date(`${dateStr}T${endTimeStr}:00`)

    const classData = {
      ...values,
      date: new Date(dateStr),
      startTime: startTime,
      endTime: endTime,
      maxCapacity: Number(values.maxCapacity),
    }

    console.log("Submitting class data:", classData)

    try {
      let result
      if (classToEdit) {
        result = await updateClass(classToEdit.id, classData)
      } else {
        result = await createClass(classData)
      }

      if (result.success) {
        toast({
          title: classToEdit ? "Class updated" : "Class created",
          description: `The class has been ${classToEdit ? "updated" : "created"} successfully.`,
          variant: "reformer",
        })
        setOpen(false)
        form.reset()
        if (onSuccess) await onSuccess()
      } else {
        throw new Error(result.error || "An unknown error occurred")
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
      console.error("Class operation error:", error)
    }
  }

  const yogaTypes = ["VINYASA", "HATHA", "BALANCE"]
  const pilatesTypes = ["STRENGTH_CORE", "LOWER_BODY", "FULL_BODY"]
  const selectedCategory = form.watch("category")

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
                    <Input
                      type="date"
                      {...field}
                      value={
                        selectedDate
                          ? selectedDate.toISOString().split("T")[0]
                          : ""
                      }
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

            <Button type="submit" className="w-full">
              {classToEdit ? "Update Class" : "Create Class"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
