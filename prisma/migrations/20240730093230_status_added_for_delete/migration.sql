-- AlterTable
ALTER TABLE "item" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "item_category" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "item_category_relation" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "pharmacy" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "pharmacy_stock" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "sku" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "stock_movement" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "warehouse" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "warehouse_stock" ADD COLUMN     "status" BOOLEAN DEFAULT true;
