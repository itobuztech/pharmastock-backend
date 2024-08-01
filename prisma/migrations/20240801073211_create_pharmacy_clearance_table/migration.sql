/*
  Warnings:

  - You are about to drop the column `pharmacyStockId_id` on the `stock_movement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stock_movement" DROP CONSTRAINT "stock_movement_pharmacyStockId_id_fkey";

-- AlterTable
ALTER TABLE "stock_movement" DROP COLUMN "pharmacyStockId_id",
ADD COLUMN     "pharmacyStockClearance_id" UUID,
ADD COLUMN     "pharmacyStock_id" UUID;

-- CreateTable
CREATE TABLE "pharmacy_stock_clearance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_id" UUID NOT NULL,
    "pharmacyStock_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN DEFAULT true,

    CONSTRAINT "pharmacy_stock_clearance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_pharmacyStock_id_fkey" FOREIGN KEY ("pharmacyStock_id") REFERENCES "pharmacy_stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_pharmacyStockClearance_id_fkey" FOREIGN KEY ("pharmacyStockClearance_id") REFERENCES "pharmacy_stock_clearance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_stock_clearance" ADD CONSTRAINT "pharmacy_stock_clearance_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_stock_clearance" ADD CONSTRAINT "pharmacy_stock_clearance_pharmacyStock_id_fkey" FOREIGN KEY ("pharmacyStock_id") REFERENCES "pharmacy_stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
