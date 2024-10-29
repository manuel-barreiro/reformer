"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        name: "asc",
      },
    })
    return { success: true, data: categories }
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return { success: false, error: "Error al obtener categorías" }
  }
}

export async function getActiveClassCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        subcategories: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
    return { success: true, data: categories }
  } catch (error) {
    console.error("Error al obtener categorías activas:", error)
    return { success: false, error: "Error al obtener categorías activas" }
  }
}

export async function createCategory(data: {
  name: string
  isActive: boolean
}) {
  try {
    const slug = data.name.toLowerCase().replace(/\s+/g, "-")
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        isActive: data.isActive,
      },
    })
    revalidatePath("/admin/categorias")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return { success: false, error: "Error al crear categoría" }
  }
}

export async function updateCategory(
  id: string,
  data: { name: string; isActive: boolean }
) {
  try {
    const slug = data.name.toLowerCase().replace(/\s+/g, "-")
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        isActive: data.isActive,
      },
    })
    revalidatePath("/admin/categorias")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return { success: false, error: "Error al actualizar categoría" }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })
    revalidatePath("/admin/categorias")
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return { success: false, error: "Error al eliminar categoría" }
  }
}

export async function createSubcategory(data: {
  name: string
  categoryId: string
  isActive: boolean
}) {
  try {
    const slug = data.name.toLowerCase().replace(/\s+/g, "-")
    const subcategory = await prisma.subcategory.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
    })
    revalidatePath("/admin/categorias")
    return { success: true, data: subcategory }
  } catch (error) {
    console.error("Error al crear subcategoría:", error)
    return { success: false, error: "Error al crear subcategoría" }
  }
}

export async function updateSubcategory(
  id: string,
  data: {
    name: string
    categoryId: string
    isActive: boolean
  }
) {
  try {
    const slug = data.name.toLowerCase().replace(/\s+/g, "-")
    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
    })
    revalidatePath("/admin/categorias")
    return { success: true, data: subcategory }
  } catch (error) {
    console.error("Error al actualizar subcategoría:", error)
    return { success: false, error: "Error al actualizar subcategoría" }
  }
}

export async function deleteSubcategory(id: string) {
  try {
    await prisma.subcategory.delete({
      where: { id },
    })
    revalidatePath("/admin/categorias")
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar subcategoría:", error)
    return { success: false, error: "Error al eliminar subcategoría" }
  }
}
