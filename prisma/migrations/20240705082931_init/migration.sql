/*
  Warnings:

  - You are about to drop the column `parentCategoryId` on the `ItemCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "ItemCategory" DROP COLUMN "parentCategoryId",
ADD COLUMN     "parentCategory" UUID;

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_parentCategory_fkey" FOREIGN KEY ("parentCategory") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
