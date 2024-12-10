/*
  Warnings:

  - The values [Unit] on the enum `BaseUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BaseUnit_new" AS ENUM ('Piece', 'Tablet', 'Roll', 'Bottle', 'Pack', 'Box');
ALTER TABLE "item" ALTER COLUMN "base_unit" TYPE "BaseUnit_new" USING ("base_unit"::text::"BaseUnit_new");
ALTER TYPE "BaseUnit" RENAME TO "BaseUnit_old";
ALTER TYPE "BaseUnit_new" RENAME TO "BaseUnit";
DROP TYPE "BaseUnit_old";
COMMIT;
