import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePharmacyStockInput {
  @Field()
  itemId: string;

  @Field()
  warehouseId: string;

  @Field()
  pharmacyId: string;

  @Field()
  qty: number;

  @Field({ name: 'finalQty' })
  final_qty: number;
}
