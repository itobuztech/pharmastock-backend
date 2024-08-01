import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ClearancePharmacyStockInput {
  @Field()
  itemId: string;

  @Field()
  pharmacyId: string;

  @Field()
  qty: number;
}
