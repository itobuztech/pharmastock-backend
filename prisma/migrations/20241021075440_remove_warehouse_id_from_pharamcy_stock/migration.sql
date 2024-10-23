/*
  Warnings:

  - You are about to drop the column `warehouse_id` on the `pharmacy_stock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pharmacy_stock" DROP CONSTRAINT "pharmacy_stock_warehouse_id_fkey";

-- AlterTable
ALTER TABLE "pharmacy_stock" DROP COLUMN "warehouse_id";
