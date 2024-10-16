-- Step 1: Create PaymentType enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "PaymentType" AS ENUM ('mercadopago', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add paymentType to Payment table if it doesn't exist
DO $$ BEGIN
    ALTER TABLE "Payment" ADD COLUMN "paymentType" "PaymentType";
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Step 3: Set default value for paymentType
ALTER TABLE "Payment" ALTER COLUMN "paymentType" SET DEFAULT 'mercadopago'::"PaymentType";

-- Step 4: Update existing payments to have the correct paymentType
UPDATE "Payment" SET "paymentType" = 
  CASE 
    WHEN "paymentId" LIKE 'MANUAL_%' THEN 'manual'::"PaymentType" 
    ELSE 'mercadopago'::"PaymentType" 
  END
WHERE "paymentType" IS NULL;

-- Step 5: Make paymentType NOT NULL
ALTER TABLE "Payment" ALTER COLUMN "paymentType" SET NOT NULL;

-- Step 6: Add deletedAt to ClassPackage table if it doesn't exist
DO $$ BEGIN
    ALTER TABLE "ClassPackage" ADD COLUMN "deletedAt" TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;