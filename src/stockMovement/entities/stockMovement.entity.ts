import { Field, ObjectType } from '@nestjs/graphql';
import { StockMovement as StockMovementDB } from '@prisma/client';

@ObjectType()
export class StockMovement {
  @Field(() => String)
  id: StockMovementDB['id'];

  @Field(() => String, { nullable: true })
  warehouseStockId: StockMovementDB['warehouseStockId'];

  @Field(() => Number)
  qty: StockMovementDB['qty'];

  @Field(() => String)
  itemId: StockMovementDB['itemId'];

  @Field(() => String, { nullable: true })
  pharmacyStockId: StockMovementDB['pharmacyStockId'];

  @Field(() => String, { name: 'batchName', nullable: true })
  batch_name?: StockMovementDB['batch_name'];

  @Field(() => Date, { nullable: true })
  expiry?: StockMovementDB['expiry'];

  @Field(() => Date)
  createdAt: StockMovementDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: StockMovementDB['updatedAt'] | null;
}
