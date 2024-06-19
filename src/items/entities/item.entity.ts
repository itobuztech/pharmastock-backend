import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Item as ItemDB } from '@prisma/client';
import { BaseUnit } from '../base-unit.enum';

@ObjectType()
export class Item {
  @Field(() => String)
  id: ItemDB['id'];

  @Field(() => BaseUnit)
  baseUnit: ItemDB['baseUnit'];

  @Field(() => String)
  instructions: ItemDB['instructions'];

  @Field(() => String)
  sku: ItemDB['sku'];

  @Field(() => Number, { nullable: true })
  mrp_base_unit?: ItemDB['mrp_base_unit'];

  @Field(() => Number, { nullable: true })
  wholesale_price?: ItemDB['wholesale_price'];

  @Field(() => String)
  hsn_code: ItemDB['hsn_code'];

  @Field(() => Date)
  createdAt: ItemDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: ItemDB['updatedAt'] | null;
}
