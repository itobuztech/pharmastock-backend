import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemCategory as ItemCategoryDB, Item as ItemDB } from '@prisma/client';

@ObjectType()
export class PharmacyStockItem {
  @Field(() => String)
  id: ItemDB['id'];

  @Field(() => String)
  name: ItemDB['name'];
}
