-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
