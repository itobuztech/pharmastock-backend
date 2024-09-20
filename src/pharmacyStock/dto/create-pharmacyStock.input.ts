import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class itemObjs {
  @Field()
  itemId: string;

  @Field()
  qty: number;
}

@InputType()
export class CreatePharmacyStockInput {
  @Field(() => [itemObjs])
  itemArr: itemObjs;

  @Field(() => ID)
  warehouseId: string;

  @Field(() => ID)
  pharmacyId: string;
}
