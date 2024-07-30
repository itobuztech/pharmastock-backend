import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  PharmacyStock as PharmacyStockDB,
  Item as ItemDB,
  Warehouse as WarehouseDB,
  Pharmacy as PharmacyDB,
} from '@prisma/client';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { Item } from '../../items/entities/item.entity';
import { Pharmacy } from '../../pharmacy/entities/pharmacy.entity';

@ObjectType()
export class PharmacyStock {
  @Field(() => String)
  id: PharmacyStockDB['id'];

  @Field(() => Item, { nullable: true })
  item?: ItemDB;

  @Field(() => Warehouse, { nullable: true })
  warehouse?: WarehouseDB;

  @Field(() => Pharmacy, { nullable: true })
  pharmacy?: PharmacyDB;

  @Field(() => Int, { name: 'finalQty' })
  final_qty: PharmacyStockDB['final_qty'];

  @Field(() => Boolean)
  status: PharmacyStockDB['status'];

  @Field(() => Date)
  createdAt: PharmacyStockDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: PharmacyStockDB['updatedAt'] | null;

  @Field(() => Number, { nullable: true })
  totalWholesalePrice?: number;

  @Field(() => Number, { nullable: true })
  totalMrpBaseUnit?: number;
}
