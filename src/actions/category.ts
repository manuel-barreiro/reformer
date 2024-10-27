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
    console.error("Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories" }
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
    console.error("Error fetching class categories:", error)
    return { success: false, error: "Failed to fetch categories" }
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
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
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
    console.error("Error updating category:", error)
    return { success: false, error: "Failed to update category" }
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
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
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
    console.error("Error creating subcategory:", error)
    return { success: false, error: "Failed to create subcategory" }
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
    console.error("Error updating subcategory:", error)
    return { success: false, error: "Failed to update subcategory" }
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
    console.error("Error deleting subcategory:", error)
    return { success: false, error: "Failed to delete subcategory" }
  }
}
