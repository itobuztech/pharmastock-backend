/*
  Warnings:

  - Added the required column `warehouseStock_id` to the `SKU` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SKU" ADD COLUMN     "warehouseStock_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_warehouseStock_id_fkey" FOREIGN KEY ("warehouseStock_id") REFERENCES "WarehouseStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
