import { Field, ObjectType } from '@nestjs/graphql';
import { PharmacyStock as PharmacyStockDB } from '@prisma/client';

@ObjectType()
export class MaxPharmacyStockQty {
  @Field(() => Number, { nullable: true, name: 'finalQty' })
  final_qty?: PharmacyStockDB['final_qty'];
}
