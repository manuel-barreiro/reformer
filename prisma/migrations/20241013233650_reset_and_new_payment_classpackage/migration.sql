/*
  Warnings:

  - You are about to drop the column `durationDays` on the `ClassPackage` table. All the data in the column will be lost.
  - You are about to drop the column `packageType` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `purchasedPackageId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `PurchasedPackage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `durationMonths` to the `ClassPackage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('active', 'expired', 'cancelled');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_purchasedPackageId_fkey";

-- DropIndex
DROP INDEX "Payment_purchasedPackageId_key";

-- AlterTable
ALTER TABLE "ClassPackage" DROP COLUMN "durationDays",
ADD COLUMN     "durationMonths" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "packageType",
DROP COLUMN "purchasedPackageId";

-- AlterTable
ALTER TABLE "PurchasedPackage" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "status" "PackageStatus" NOT NULL DEFAULT 'active';

-- DropEnum
DROP TYPE "PackageType";

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedPackage_paymentId_key" ON "PurchasedPackage"("paymentId");

-- AddForeignKey
ALTER TABLE "PurchasedPackage" ADD CONSTRAINT "PurchasedPackage_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
