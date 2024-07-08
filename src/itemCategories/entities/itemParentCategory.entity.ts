import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemCategory as ItemCategoryDB, Item as ItemDB } from '@prisma/client';
import { Item } from '../../items/entities/item.entity';

@ObjectType()
export class ItemParentCategory {
  @Field(() => String, { nullable: true })
  id: ItemCategoryDB['id'];

  @Field(() => String, { nullable: true })
  name: ItemCategoryDB['name'];

  @Field(() => Date, { nullable: true })
  createdAt: ItemCategoryDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: ItemCategoryDB['updatedAt'] | null;

  @Field(() => [Item], { nullable: true })
  Item?: ItemDB;
}
