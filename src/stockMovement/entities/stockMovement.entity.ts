import { Field, ObjectType } from '@nestjs/graphql';
import { StockMovement as StockMovementDB } from '@prisma/client';

@ObjectType()
export class StockMovement {
  @Field(() => String)
  id: StockMovementDB['id'];

  @Field(() => String, { name: 'batchName', nullable: true })
  batch_name?: StockMovementDB['batch_name'];

  @Field(() => Number)
  qty: StockMovementDB['qty'];

  @Field(() => Date, { nullable: true })
  expiry?: StockMovementDB['expiry'];

  @Field(() => Date)
  createdAt: StockMovementDB['createdAt'];

  @Field(() => String)
  lotName?: StockMovementDB['lot_name'];

  @Field(() => String)
  transactionType?: StockMovementDB['transactionType'];

  @Field(() => Date, { nullable: true })
  updatedAt: StockMovementDB['updatedAt'] | null;

  @Field(() => String, { nullable: true })
  organisation?: string;

  @Field(() => String, { nullable: true })
  item?: string;

  @Field(() => String, { nullable: true })
  warehouse?: string;
}
