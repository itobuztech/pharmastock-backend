import { Field, ObjectType } from '@nestjs/graphql';
import { PharmacyStock as PharmacyStockDB } from '@prisma/client';

@ObjectType()
export class MaxPharmacyStockQty {
  @Field(() => Number, { nullable: true })
  totalQty?: PharmacyStockDB['final_qty'];
}
