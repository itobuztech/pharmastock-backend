import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStockMovementInput {
  @Field({ nullable: true })
  warehouseStockId?: string;

  @Field()
  itemId: string;

  @Field({ nullable: true })
  pharmacyStockId?: string;

  @Field({ nullable: true })
  pharmacyStockClearanceId?: string;

  @Field()
  qty: number;

  @Field({ nullable: true })
  batchName: string;

  @Field(() => Date, { nullable: true })
  expiry: Date;
}
