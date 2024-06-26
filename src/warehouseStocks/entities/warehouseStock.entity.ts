import { Field, Int, ObjectType } from '@nestjs/graphql';
import { WarehouseStock as WarehouseStockDB } from '@prisma/client';
import { StockLevel } from '../stock-level.enum';

@ObjectType()
export class WarehouseStock {
  @Field(() => String)
  id: WarehouseStockDB['id'];

  @Field(() => String, { nullable: true })
  itemId: WarehouseStockDB['itemId'];

  @Field(() => String, { nullable: true })
  warehouseId: WarehouseStockDB['warehouseId'];

  @Field(() => Number, { nullable: true, name: 'stocklevelMin' })
  stocklevel_min?: WarehouseStockDB['stocklevel_min'];

  @Field(() => Number, { nullable: true, name: 'stocklevelMax' })
  stocklevel_max?: WarehouseStockDB['stocklevel_max'];

  @Field(() => String, { nullable: true, name: 'stockStatus' })
  stock_status?: WarehouseStockDB['stock_status'];

  @Field(() => StockLevel, { nullable: true })
  stockLevel?: WarehouseStockDB['stockLevel'];

  @Field(() => Number, { name: 'finalQty' })
  final_qty: WarehouseStockDB['final_qty'];

  @Field(() => Date)
  createdAt: WarehouseStockDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: WarehouseStockDB['updatedAt'] | null;
}
