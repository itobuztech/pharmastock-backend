import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Item as ItemDB } from '@prisma/client';

@ObjectType()
export class MaxPrice {
  @Field(() => Number, { nullable: true, name: 'mrpBaseUnit' })
  mrp_base_unit?: ItemDB['mrp_base_unit'];

  @Field(() => Number, { nullable: true, name: 'wholesalePrice' })
  wholesale_price?: ItemDB['wholesale_price'];
}
