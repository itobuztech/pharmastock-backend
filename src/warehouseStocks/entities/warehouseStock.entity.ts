import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  WarehouseStock as WarehouseStockDB,
  Warehouse as WarehouseDB,
  Item as ItemDB,
} from '@prisma/client';
import { StockLevel } from '../stock-level.enum';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { Item } from '../../items/entities/item.entity';

@ObjectType()
export class WarehouseStock {
  @Field(() => String)
  id: WarehouseStockDB['id'];

  @Field(() => Item, { nullable: true })
  item?: ItemDB;

  @Field(() => Warehouse, { nullable: true })
  warehouse?: WarehouseDB;

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
