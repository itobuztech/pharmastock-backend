/*
  Warnings:

  - You are about to drop the column `admin_id` on the `warehouse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "warehouse" DROP CONSTRAINT "warehouse_admin_id_fkey";

-- AlterTable
ALTER TABLE "warehouse" DROP COLUMN "admin_id";
