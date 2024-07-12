/*
  Warnings:

  - You are about to drop the column `sku` on the `StockMovement` table. All the data in the column will be lost.
  - You are about to drop the column `stock_level` on the `WarehouseStock` table. All the data in the column will be lost.
  - You are about to drop the column `stock_status` on the `WarehouseStock` table. All the data in the column will be lost.
  - You are about to drop the column `stocklevel_max` on the `WarehouseStock` table. All the data in the column will be lost.
  - You are about to drop the column `stocklevel_min` on the `WarehouseStock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "sku";

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WarehouseStock" DROP COLUMN "stock_level",
DROP COLUMN "stock_status",
DROP COLUMN "stocklevel_max",
DROP COLUMN "stocklevel_min";

-- CreateTable
CREATE TABLE "SKU" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sku" TEXT NOT NULL,
    "item_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "stocklevel_min" INTEGER,
    "stocklevel_max" INTEGER,
    "stock_status" TEXT,
    "stock_level" "StockLevel",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SKU_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SKU_sku_key" ON "SKU"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_name_key" ON "Warehouse"("name");

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
