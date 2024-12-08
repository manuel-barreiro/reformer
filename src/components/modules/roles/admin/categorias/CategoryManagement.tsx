"use client"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Category as PrismaCategory, Subcategory } from "@prisma/client"

interface Category extends PrismaCategory {
  subcategories: Subcategory[]
}
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "@/actions/category"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import ActionDialog from "@/components/modules/roles/common/ActionDialog"

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteSubDialogOpen, setDeleteSubDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string>("")

  const handleDeleteCategory = async (id: string) => {
    const result = await deleteCategory(id)
    if (result.success) {
      toast({
        title: "Categoría eliminada",
        description: "Category eliminada exitosamente",
        variant: "reformer",
      })
      loadCategories()
    }
  }

  const handleDeleteSubcategory = async (id: string) => {
    const result = await deleteSubcategory(id)
    if (result.success) {
      toast({
        title: "Subcategoría eliminada",
        description: "Subcategory eliminada exitosamente",
        variant: "reformer",
      })
      loadCategories()
    }
  }

  const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    isActive: z.boolean().default(true),
  })

  const subcategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().min(1, "Category is required"),
    isActive: z.boolean().default(true),
  })

  const categoryForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  })

  const subcategoryForm = useForm({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
      isActive: true,
    },
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const result = await getCategories()
      if (result.success && result.data) {
        setCategories(result.data)
      } else {
        toast({
          title: "Error",
          description: "Error al cargar categorías",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar categorías",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    categoryForm.reset({
      name: category.name,
      isActive: category.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory)
    subcategoryForm.reset({
      name: subcategory.name,
      categoryId: subcategory.categoryId,
      isActive: subcategory.isActive,
    })
    setIsSubcategoryDialogOpen(true)
  }

  const handleAddSubcategory = (categoryId: string) => {
    subcategoryForm.reset({
      name: "",
      categoryId,
      isActive: true,
    })
    setIsSubcategoryDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Panel de Categorías</h1>
        {/* Para crear nuevas categorias */}
        {/* <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setSelectedCategory(null)
              categoryForm.reset()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>
            </DialogHeader>
            <Form {...categoryForm}>
              <form
                onSubmit={categoryForm.handleSubmit(async (data) => {
                  try {
                    const result = selectedCategory
                      ? await updateCategory(selectedCategory.id, data)
                      : await createCategory(data)

                    if (result.success) {
                      toast({
                        title: `Categoría ${selectedCategory ? "editada" : "creada"}`,
                        description: `Categoría ${selectedCategory ? "editada" : "creada"} exitosamente`,
                        variant: "reformer",
                      })
                      loadCategories()
                      setIsDialogOpen(false)
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: `Error al ${selectedCategory ? "editar" : "crear"} categoría`,
                      variant: "destructive",
                    })
                  }
                })}
                className="space-y-4"
              >
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ingresa el nombre de la categoría"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={categoryForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Status</FormLabel>
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
                <Button type="submit" className="w-full">
                  {selectedCategory ? "Editar Categoría" : "Crear Categoría"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog> */}
      </div>
      <ScrollArea className="md:h-[530px]">
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading && (
            <>
              <Skeleton className="h-96 bg-pearlVariant" />
              <Skeleton className="h-96 bg-pearlVariant" />
            </>
          )}
          {categories.map((category) => (
            <Card key={category.id} className="bg-pearlVariant">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex flex-row items-center gap-4">
                  <span className="text-xl font-bold">{category.name}</span>
                  <div className="flex justify-between">
                    <CardDescription>
                      {category.isActive ? (
                        <Badge className="font-dm_mono text-[10px]">
                          ACTIVO
                        </Badge>
                      ) : (
                        <Badge className="font-dm_mono text-[10px]">
                          INACTIVO
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </CardTitle>
                <div className="flex space-x-2">
                  {/* Estos botones permiten editar o eliminar categorias */}
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <ActionDialog
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                    title="Eliminar Categoría"
                    description={`¿Estás seguro que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`}
                    action={() => handleDeleteCategory(category.id)}
                    buttonText="Eliminar"
                    icon={<Trash2 className="h-4 w-4" />}
                    buttons={true}
                  /> */}
                  <Button
                    onClick={() => handleAddSubcategory(category.id)}
                    className="mt-2 flex w-full items-center gap-4 bg-rust hover:bg-rust/90"
                  >
                    <Plus className="h-4 w-4" />
                    {/* <span className="hidden lg:block">Nueva Subcategoría</span> */}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="flex items-center justify-between p-2"
                    >
                      <div>
                        <p className="font-medium">{subcategory.name}</p>
                        <p className="text-sm text-gray-500">
                          {subcategory.isActive ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSubcategory(subcategory)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <ActionDialog
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Eliminar Subcategoría"
                          description={`¿Estás seguro que deseas eliminar la subcategoría "${subcategory.name}"? Esta acción no se puede deshacer.`}
                          action={() => handleDeleteSubcategory(subcategory.id)}
                          buttonText="Eliminar"
                          icon={<Trash2 className="h-4 w-4" />}
                          buttons={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Dialog
        open={isSubcategoryDialogOpen}
        onOpenChange={(open) => {
          setIsSubcategoryDialogOpen(open)
          if (!open) {
            setSelectedSubcategory(null)
            subcategoryForm.reset()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSubcategory
                ? "Editar Subcategoría"
                : "Nueva Subcategoría"}
            </DialogTitle>
          </DialogHeader>
          <Form {...subcategoryForm}>
            <form
              onSubmit={subcategoryForm.handleSubmit(async (data) => {
                try {
                  const result = selectedSubcategory
                    ? await updateSubcategory(selectedSubcategory.id, data)
                    : await createSubcategory(data)

                  if (result.success) {
                    toast({
                      title: `Subcategoría ${selectedSubcategory ? "editada" : "creada"}`,
                      description: `Subcategoría ${selectedSubcategory ? "editada" : "creada"} exitosamente`,
                      variant: "reformer",
                    })
                    loadCategories()
                    setIsSubcategoryDialogOpen(false)
                  }
                } catch (error) {
                  toast({
                    title: "Error",
                    description: `Error al ${selectedSubcategory ? "editar" : "crear"} subcategoría`,
                    variant: "destructive",
                  })
                }
              })}
              className="space-y-4"
            >
              <FormField
                control={subcategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ingrese el nombre de la nueva subcategoría"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subcategoryForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Status</FormLabel>
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
              <Button type="submit" className="w-full">
                {selectedSubcategory
                  ? "Editar Subcategoría"
                  : "Crear Subcategoría"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoryManagement
