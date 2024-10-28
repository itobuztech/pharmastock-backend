import { Field, ObjectType } from '@nestjs/graphql';
import { StockMovement } from './stockMovement.entity';

@ObjectType()
export class StockMovementsByLot extends StockMovement {
  @Field(() => Number)
  totalLotItemsQty: number;
}
