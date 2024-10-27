import { Suspense } from "react"
import CategoryManagement from "@/components/modules/roles/admin/categorias/CategoryManagement"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryManagement />
      </Suspense>
    </div>
  )
}
