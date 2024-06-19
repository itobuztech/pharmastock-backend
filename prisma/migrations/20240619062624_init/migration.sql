/*
  Warnings:

  - You are about to drop the column `parent_category_id` on the `ItemCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_parent_category_id_fkey";

-- AlterTable
ALTER TABLE "ItemCategory" DROP COLUMN "parent_category_id",
ADD COLUMN     "parentCategoryId" UUID;

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
