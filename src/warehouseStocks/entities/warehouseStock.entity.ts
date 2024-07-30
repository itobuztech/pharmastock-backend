import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  WarehouseStock as WarehouseStockDB,
  Warehouse as WarehouseDB,
  Item as ItemDB,
  SKU as skuDB,
} from '@prisma/client';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { Item } from '../../items/entities/item.entity';
import { Sku } from './sku.entity';

@ObjectType()
export class WarehouseStock {
  @Field(() => String)
  id: WarehouseStockDB['id'];

  @Field(() => Item)
  item?: ItemDB;

  @Field(() => Warehouse)
  warehouse?: WarehouseDB;

  @Field(() => Sku)
  SKU?: skuDB;

  @Field(() => Number, { name: 'finalQty' })
  final_qty: WarehouseStockDB['final_qty'];

  @Field(() => Boolean)
  status: WarehouseStockDB['status'];

  @Field(() => Date)
  createdAt: WarehouseStockDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: WarehouseStockDB['updatedAt'] | null;

  @Field(() => Number, { nullable: true })
  totalWholesalePrice?: number;

  @Field(() => Number, { nullable: true })
  totalMrpBaseUnit?: number;
}
