-- DropForeignKey
ALTER TABLE "item_category" DROP CONSTRAINT "item_category_parent_category_id_fkey";

-- DropForeignKey
ALTER TABLE "pharmacy" DROP CONSTRAINT "pharmacy_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "pharmacy_stock" DROP CONSTRAINT "pharmacy_stock_item_id_fkey";

-- DropForeignKey
ALTER TABLE "pharmacy_stock" DROP CONSTRAINT "pharmacy_stock_pharmacy_id_fkey";

-- DropForeignKey
ALTER TABLE "pharmacy_stock" DROP CONSTRAINT "pharmacy_stock_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movement" DROP CONSTRAINT "stock_movement_item_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movement" DROP CONSTRAINT "stock_movement_pharmacyStockId_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movement" DROP CONSTRAINT "stock_movement_warehouseStock_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse" DROP CONSTRAINT "warehouse_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse" DROP CONSTRAINT "warehouse_organization_id_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_category" ADD CONSTRAINT "item_category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "item_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_warehouseStock_id_fkey" FOREIGN KEY ("warehouseStock_id") REFERENCES "warehouse_stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_pharmacyStockId_id_fkey" FOREIGN KEY ("pharmacyStockId_id") REFERENCES "pharmacy_stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_stock" ADD CONSTRAINT "pharmacy_stock_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_stock" ADD CONSTRAINT "pharmacy_stock_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_stock" ADD CONSTRAINT "pharmacy_stock_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
