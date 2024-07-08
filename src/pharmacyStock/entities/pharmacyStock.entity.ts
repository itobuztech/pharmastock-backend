import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  PharmacyStock as PharmacyStockDB,
  Warehouse as WarehouseDB,
  Pharmacy as PharmacyDB,
} from '@prisma/client';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { Pharmacy } from '../../pharmacy/entities/pharmacy.entity';

@ObjectType()
export class PharmacyStock {
  @Field(() => String)
  id: PharmacyStockDB['id'];

  @Field(() => String)
  itemId: PharmacyStockDB['itemId'];

  @Field(() => Warehouse, { nullable: true })
  warehouse?: WarehouseDB;

  @Field(() => Pharmacy, { nullable: true })
  pharmacy?: PharmacyDB;

  @Field(() => Int, { name: 'finalQty' })
  final_qty: PharmacyStockDB['final_qty'];

  @Field(() => Date)
  createdAt: PharmacyStockDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: PharmacyStockDB['updatedAt'] | null;
}
