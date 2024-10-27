export interface Category {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
  category: Category
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CategoryFormData {
  name: string
  isActive: boolean
}

export interface SubcategoryFormData {
  name: string
  categoryId: string
  isActive: boolean
}
