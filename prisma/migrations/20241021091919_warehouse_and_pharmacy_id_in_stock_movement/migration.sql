-- AlterTable
ALTER TABLE "stock_movement" ADD COLUMN     "pharmacy_id" UUID,
ADD COLUMN     "warehouse_id" UUID;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
