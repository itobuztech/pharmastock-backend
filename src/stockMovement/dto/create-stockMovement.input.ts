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
  transactionType?: string;

  @Field({ nullable: true })
  pharmacyStockClearanceId?: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field({ nullable: true })
  warehouseId?: string;

  @Field({ nullable: true })
  pharmacyId?: string;

  @Field()
  lotName: string;

  @Field()
  qty: number;

  @Field({ nullable: true })
  batchName: string;

  @Field(() => Date, { nullable: true })
  expiry: Date;
}
