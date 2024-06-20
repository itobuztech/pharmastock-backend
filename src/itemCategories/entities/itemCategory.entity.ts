import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemCategory as ItemCategoryDB, Item as ItemDB } from '@prisma/client';
import { Item } from 'src/items/entities/item.entity';

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

  @Field(() => [Item], { nullable: true })
  Item?: ItemDB;
}
