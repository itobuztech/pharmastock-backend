import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemCategory as ItemCategoryDB, Item as ItemDB } from '@prisma/client';
import { Item } from 'src/items/entities/item.entity';
import { ItemParentCategory } from './itemParentCategory.entity';

@ObjectType()
export class ItemCategory {
  @Field(() => String)
  id: ItemCategoryDB['id'];

  @Field(() => String)
  name: ItemCategoryDB['name'];

  @Field(() => Boolean)
  status: ItemCategoryDB['status'];

  @Field(() => ItemParentCategory, { nullable: true })
  parentCategory?: ItemParentCategory;

  @Field(() => Date)
  createdAt: ItemCategoryDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: ItemCategoryDB['updatedAt'] | null;

  @Field(() => [Item], { nullable: true })
  Item?: ItemDB;
}
