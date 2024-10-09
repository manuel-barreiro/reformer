/*
  Warnings:

  - The values [pkg_1_yoga,pkg_4_yoga,pkg_8_yoga,pkg_12_yoga,pkg_1_pilates,pkg_4_pilates,pkg_8_pilates,pkg_12_pilates] on the enum `PackageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PackageType_new" AS ENUM ('pkg_1', 'pkg_4', 'pkg_8', 'pkg_12');
ALTER TABLE "Payment" ALTER COLUMN "packageType" TYPE "PackageType_new" USING ("packageType"::text::"PackageType_new");
ALTER TYPE "PackageType" RENAME TO "PackageType_old";
ALTER TYPE "PackageType_new" RENAME TO "PackageType";
DROP TYPE "PackageType_old";
COMMIT;
