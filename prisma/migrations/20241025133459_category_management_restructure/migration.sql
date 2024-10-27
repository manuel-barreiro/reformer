-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_slug_key" ON "Subcategory"("slug");

-- CreateIndex
CREATE INDEX "Subcategory_categoryId_idx" ON "Subcategory"("categoryId");

-- Insert initial categories
INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
VALUES 
    ('cat_yoga', 'Yoga', 'yoga', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_pilates', 'Pilates', 'pilates', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial subcategories
INSERT INTO "Subcategory" (id, name, slug, "categoryId", "createdAt", "updatedAt")
VALUES 
    ('sub_vinyasa', 'Vinyasa', 'vinyasa', 'cat_yoga', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sub_hatha', 'Hatha', 'hatha', 'cat_yoga', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sub_balance', 'Balance', 'balance', 'cat_yoga', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sub_strength', 'Strength Core', 'strength-core', 'cat_pilates', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sub_lower', 'Lower Body', 'lower-body', 'cat_pilates', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sub_full', 'Full Body', 'full-body', 'cat_pilates', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add nullable columns first
ALTER TABLE "Class" 
ADD COLUMN "categoryId" TEXT,
ADD COLUMN "subcategoryId" TEXT;

-- Update existing classes with the new IDs
UPDATE "Class"
SET 
    "categoryId" = CASE 
        WHEN category = 'YOGA' THEN 'cat_yoga'
        WHEN category = 'PILATES' THEN 'cat_pilates'
    END,
    "subcategoryId" = CASE 
        WHEN type = 'VINYASA' THEN 'sub_vinyasa'
        WHEN type = 'HATHA' THEN 'sub_hatha'
        WHEN type = 'BALANCE' THEN 'sub_balance'
        WHEN type = 'STRENGTH_CORE' THEN 'sub_strength'
        WHEN type = 'LOWER_BODY' THEN 'sub_lower'
        WHEN type = 'FULL_BODY' THEN 'sub_full'
    END;

-- Now make the columns required
ALTER TABLE "Class" 
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "subcategoryId" SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE "Subcategory"
ADD CONSTRAINT "Subcategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE;

ALTER TABLE "Class"
ADD CONSTRAINT "Class_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id"),
ADD CONSTRAINT "Class_subcategoryId_fkey"
FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id");

-- Create indices
CREATE INDEX "Class_categoryId_idx" ON "Class"("categoryId");
CREATE INDEX "Class_subcategoryId_idx" ON "Class"("subcategoryId");

-- Drop old columns
ALTER TABLE "Class" DROP COLUMN "category";
ALTER TABLE "Class" DROP COLUMN "type";

-- Drop the enums
DROP TYPE IF EXISTS "ClassCategory";
DROP TYPE IF EXISTS "ClassType";