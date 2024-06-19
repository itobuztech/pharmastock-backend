import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemCategory as ItemCategoryDB } from '@prisma/client';

@ObjectType()
export class ItemCategory {
  @Field(() => String)
  id: ItemCategoryDB['id'];

  @Field(() => String)
  name: ItemCategoryDB['name'];

  @Field(() => String, { nullable: true })
  parentCategoryId: ItemCategoryDB['parentCategoryId'];

  @Field(() => Date)
  createdAt: ItemCategoryDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: ItemCategoryDB['updatedAt'] | null;
}
