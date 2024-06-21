import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PharmacyStock as PharmacyStockDB } from '@prisma/client';

@ObjectType()
export class PharmacyStock {
  @Field(() => String)
  id: PharmacyStockDB['id'];

  @Field(() => String)
  itemId: PharmacyStockDB['itemId'];

  @Field(() => String)
  warehouseId: PharmacyStockDB['warehouseId'];

  @Field(() => String)
  pharmacyId: PharmacyStockDB['pharmacyId'];

  @Field(() => Int)
  qty: PharmacyStockDB['qty'];

  @Field(() => Int, { name: 'finalQty' })
  final_qty: PharmacyStockDB['final_qty'];

  @Field(() => Date)
  createdAt: PharmacyStockDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: PharmacyStockDB['updatedAt'] | null;
}
