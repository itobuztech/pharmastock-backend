/*
  Warnings:

  - Added the required column `warehouse_id` to the `SKU` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SKU" ADD COLUMN     "warehouse_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
