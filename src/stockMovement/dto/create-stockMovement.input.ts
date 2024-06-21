import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStockMovementInput {
  @Field()
  warehouseStockId?: string;

  @Field()
  itemId?: string;

  @Field()
  pharmacyStockId?: string;

  @Field()
  qty: number;

  @Field()
  finalQty: number;

  @Field()
  batchName: string;

  @Field(() => Date)
  expiry: Date;
}
