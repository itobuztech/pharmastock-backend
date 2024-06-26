/*
  Warnings:

  - You are about to drop the column `qty` on the `PharmacyStock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_id]` on the table `WarehouseStock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PharmacyStock" DROP COLUMN "qty";

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStock_item_id_key" ON "WarehouseStock"("item_id");
