-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ENTRY', 'MOVEMENT', 'EXIT');

-- AlterTable
ALTER TABLE "stock_movement" ADD COLUMN     "transaction_type" "TransactionType";
