-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_pharmacyStockId_id_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_warehouseStock_id_fkey";

-- AlterTable
ALTER TABLE "StockMovement" ALTER COLUMN "warehouseStock_id" DROP NOT NULL,
ALTER COLUMN "pharmacyStockId_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_warehouseStock_id_fkey" FOREIGN KEY ("warehouseStock_id") REFERENCES "WarehouseStock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_pharmacyStockId_id_fkey" FOREIGN KEY ("pharmacyStockId_id") REFERENCES "PharmacyStock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
