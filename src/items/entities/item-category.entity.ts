import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemCategory as ItemCategoryDB } from '@prisma/client';
import { ItemParentCategory } from '../../itemCategories/entities/itemParentCategory.entity';

@ObjectType()
export class ItemCategoryRel {
  @Field(() => String)
  id: ItemCategoryDB['id'];

  @Field(() => String)
  name: ItemCategoryDB['name'];

  @Field(() => Date)
  createdAt: ItemCategoryDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: ItemCategoryDB['updatedAt'] | null;
}
