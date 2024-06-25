-- AlterTable
ALTER TABLE "WarehouseStock" ALTER COLUMN "stocklevel_min" DROP NOT NULL,
ALTER COLUMN "stocklevel_max" DROP NOT NULL,
ALTER COLUMN "stock_status" DROP NOT NULL,
ALTER COLUMN "stock_level" DROP NOT NULL;
