-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "packageId" TEXT,
    "dateCreated" TIMESTAMP(3) NOT NULL,
    "dateLastUpdated" TIMESTAMP(3) NOT NULL,
    "moneyReleaseDate" TIMESTAMP(3),
    "items" JSONB,
    "description" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "statusDetail" TEXT,
    "paymentTypeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
