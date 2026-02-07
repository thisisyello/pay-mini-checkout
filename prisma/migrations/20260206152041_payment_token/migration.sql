/*
  Warnings:

  - A unique constraint covering the columns `[paymentToken]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN "paymentToken" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentUsedAt" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentToken_key" ON "Order"("paymentToken");
