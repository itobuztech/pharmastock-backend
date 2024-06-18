-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_organization_id_fkey";

-- AlterTable
ALTER TABLE "Warehouse" ALTER COLUMN "organization_id" DROP NOT NULL,
ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
