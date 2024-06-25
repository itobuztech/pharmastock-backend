import { Field, ObjectType } from '@nestjs/graphql';
import { StockMovement as StockMovementDB } from '@prisma/client';

@ObjectType()
export class StockMovement {
  @Field(() => String)
  id: StockMovementDB['id'];

  @Field(() => String)
  warehouseStockId: StockMovementDB['warehouseStockId'];

  @Field(() => Number)
  qty: StockMovementDB['qty'];

  @Field(() => Number, { name: 'finalQty' })
  final_qty: StockMovementDB['final_qty'];

  @Field(() => String)
  itemId: StockMovementDB['itemId'];

  @Field(() => String)
  pharmacyStockId: StockMovementDB['pharmacyStockId'];

  @Field(() => String, { name: 'batchName' })
  batch_name: StockMovementDB['batch_name'];

  @Field(() => Date)
  expiry: StockMovementDB['expiry'];

  @Field(() => Date)
  createdAt: StockMovementDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: StockMovementDB['updatedAt'] | null;
}
