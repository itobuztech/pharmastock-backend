/*
  Warnings:

  - A unique constraint covering the columns `[warehouseStock_id]` on the table `SKU` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SKU_warehouseStock_id_key" ON "SKU"("warehouseStock_id");
