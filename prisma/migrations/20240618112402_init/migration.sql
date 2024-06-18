/*
  Warnings:

  - You are about to alter the column `name` on the `Pharmacy` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `contact_info` on the `Pharmacy` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - A unique constraint covering the columns `[name]` on the table `Pharmacy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Pharmacy" DROP CONSTRAINT "Pharmacy_organization_id_fkey";

-- AlterTable
ALTER TABLE "Pharmacy" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "organization_id" DROP NOT NULL,
ALTER COLUMN "contact_info" SET DATA TYPE VARCHAR(12);

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_name_key" ON "Pharmacy"("name");

-- AddForeignKey
ALTER TABLE "Pharmacy" ADD CONSTRAINT "Pharmacy_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
