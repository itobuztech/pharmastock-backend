import { InputType, Field } from '@nestjs/graphql';
import { StockLevel } from '../stock-level.enum';

@InputType()
export class CreateWarehouseStockInput {
  @Field()
  itemId: string;

  @Field()
  warehouseId: string;

  @Field({ nullable: true })
  stocklevelMin: number;

  @Field({ nullable: true })
  stocklevelMax: number;

  @Field({ nullable: true })
  stockStatus: string;

  @Field({ nullable: true })
  stockLevel: StockLevel;

  @Field()
  qty: number;

  @Field()
  batchName: string;

  @Field()
  expiry: Date;
}
