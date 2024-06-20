import { Field, ObjectType } from '@nestjs/graphql';
import { ItemCategoryRelation as ItemCategoryRelationDB } from '@prisma/client';

@ObjectType()
export class ItemCategoryRelation {
  @Field(() => String)
  id: ItemCategoryRelationDB['id'];

  @Field(() => String)
  itemCategoryId: ItemCategoryRelationDB['itemCategoryId'];

  @Field(() => String)
  itemId: ItemCategoryRelationDB['itemId'];

  @Field(() => Date)
  createdAt: ItemCategoryRelationDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: ItemCategoryRelationDB['updatedAt'] | null;
}
