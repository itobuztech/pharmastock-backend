/*
  Warnings:

  - You are about to drop the column `sku` on the `Item` table. All the data in the column will be lost.
  - Added the required column `sku` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "sku";

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "sku" TEXT NOT NULL;
