-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pharmacy_id" UUID;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
