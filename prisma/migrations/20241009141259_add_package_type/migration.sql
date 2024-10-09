-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('pkg_1_yoga', 'pkg_4_yoga', 'pkg_8_yoga', 'pkg_12_yoga', 'pkg_1_pilates', 'pkg_4_pilates', 'pkg_8_pilates', 'pkg_12_pilates');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "packageType" "PackageType";

-- Update existing rows with a default value
UPDATE "Payment" SET "packageType" = 'pkg_1_pilates' WHERE "packageType" IS NULL;

-- Make packageType NOT NULL after updating existing rows
ALTER TABLE "Payment" ALTER COLUMN "packageType" SET NOT NULL;

-- Remove the old packageId column
ALTER TABLE "Payment" DROP COLUMN "packageId";

-- Remove the items column
ALTER TABLE "Payment" DROP COLUMN "items";