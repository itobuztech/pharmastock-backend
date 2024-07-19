-- DropForeignKey
ALTER TABLE "sku" DROP CONSTRAINT "sku_item_id_fkey";

-- DropForeignKey
ALTER TABLE "sku" DROP CONSTRAINT "sku_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "sku" DROP CONSTRAINT "sku_warehouseStock_id_fkey";

-- DropForeignKey
ALTER TABLE "sku" DROP CONSTRAINT "sku_warehouse_id_fkey";

-- AddForeignKey
ALTER TABLE "sku" ADD CONSTRAINT "sku_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku" ADD CONSTRAINT "sku_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku" ADD CONSTRAINT "sku_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku" ADD CONSTRAINT "sku_warehouseStock_id_fkey" FOREIGN KEY ("warehouseStock_id") REFERENCES "warehouse_stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
