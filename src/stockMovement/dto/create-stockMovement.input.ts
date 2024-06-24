import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStockMovementInput {
  @Field({ nullable: true })
  warehouseStockId?: string;

  @Field()
  itemId: string;

  @Field({ nullable: true })
  pharmacyStockId?: string;

  @Field()
  qty: number;

  @Field()
  batchName: string;

  @Field(() => Date)
  expiry: Date;
}
