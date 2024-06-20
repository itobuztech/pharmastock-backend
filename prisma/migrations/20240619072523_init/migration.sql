-- CreateTable
CREATE TABLE "ItemCategoryRelation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_category_id" UUID,
    "item_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemCategoryRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemCategoryRelation" ADD CONSTRAINT "ItemCategoryRelation_item_category_id_fkey" FOREIGN KEY ("item_category_id") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCategoryRelation" ADD CONSTRAINT "ItemCategoryRelation_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
