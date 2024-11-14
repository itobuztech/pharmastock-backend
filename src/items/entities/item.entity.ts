import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemCategory as ItemCategoryDB, Item as ItemDB } from '@prisma/client';
import { BaseUnit } from '../base-unit.enum';
import { ItemCategoryRel } from './item-category.entity';

@ObjectType()
export class Item {
  @Field(() => String)
  id: ItemDB['id'];

  @Field(() => BaseUnit)
  baseUnit: ItemDB['baseUnit'];

  @Field(() => String)
  name: ItemDB['name'];

  @Field(() => String)
  instructions: ItemDB['instructions'];

  @Field(() => Number, { nullable: true, name: 'mrpBaseUnit' })
  mrp_base_unit?: ItemDB['mrp_base_unit'];

  @Field(() => Number, { nullable: true, name: 'wholesalePrice' })
  wholesale_price?: ItemDB['wholesale_price'];

  @Field(() => String, { nullable: true })
  currency?: string;

  @Field(() => String, { name: 'hsnCode' })
  hsn_code: ItemDB['hsn_code'];

  @Field(() => Boolean)
  status: ItemDB['status'];

  @Field(() => Date)
  createdAt: ItemDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: ItemDB['updatedAt'] | null;

  @Field(() => [ItemCategoryRel], { nullable: true })
  Category?: ItemCategoryDB;
}
