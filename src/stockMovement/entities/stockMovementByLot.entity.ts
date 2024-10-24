import { Field, ObjectType } from '@nestjs/graphql';
import { StockMovementsByBatch } from './stockMovementByBatch.entity';

@ObjectType()
export class StockMovementsByLot extends StockMovementsByBatch {}
