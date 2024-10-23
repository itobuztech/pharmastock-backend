import { Field, ObjectType } from '@nestjs/graphql';
import { StockMovement as StockMovementDB } from '@prisma/client';
import { StockMovement } from './stockMovement.entity';

@ObjectType()
export class StockMovementsByBatch extends StockMovement {
  @Field(() => String, { nullable: true })
  pharmacy?: string;

  @Field(() => String, { nullable: true })
  pharmacyClearance?: string;
}
