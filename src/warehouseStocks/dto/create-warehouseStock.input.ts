import { InputType, Field } from '@nestjs/graphql';
import { StockLevel } from '../stock-level.enum';

@InputType()
export class CreateWarehouseStockInput {
  @Field({ nullable: true })
  itemId?: string;

  @Field({ nullable: true })
  warehouseId?: string;

  @Field()
  stocklevel_min: number;

  @Field()
  stocklevel_max: number;

  @Field()
  stock_status: string;

  @Field()
  stockLevel: StockLevel;
}
