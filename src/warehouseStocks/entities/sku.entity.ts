import { Field, ObjectType } from '@nestjs/graphql';
import { SKU as skuDB } from '@prisma/client';

@ObjectType()
export class Sku {
  @Field(() => String)
  id: skuDB['id'];

  @Field(() => String)
  sku?: skuDB['sku'];

  @Field(() => String, { nullable: true, name: 'stocklevelMin' })
  stocklevel_min?: skuDB['stocklevel_min'];

  @Field(() => String, { nullable: true, name: 'stocklevelMax' })
  stocklevel_max?: skuDB['stocklevel_max'];

  @Field(() => String, { nullable: true, name: 'stockStatus' })
  stock_status?: skuDB['stock_status'];

  @Field(() => String)
  stockLevel?: skuDB['stockLevel'];

  @Field(() => Date)
  createdAt: skuDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: skuDB['updatedAt'] | null;
}
