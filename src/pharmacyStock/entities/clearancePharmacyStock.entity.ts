import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  PharmacyStockClearance as PharmacyStockClearanceDB,
  PharmacyStock as PharmacyStockDB,
  Item as ItemDB,
  Pharmacy as PharmacyDB,
} from '@prisma/client';
import { Item } from '../../items/entities/item.entity';
import { Pharmacy } from '../../pharmacy/entities/pharmacy.entity';
import { PharmacyStock } from '../../pharmacyStock/entities/pharmacyStock.entity';

@ObjectType()
export class ClearancePharmacyStock {
  @Field(() => String)
  id: PharmacyStockClearanceDB['id'];

  @Field(() => Item, { nullable: true })
  item?: ItemDB;

  @Field(() => PharmacyStock, { nullable: true })
  pharmacyStock?: PharmacyStockDB;

  @Field(() => Int)
  qty: PharmacyStockClearanceDB['qty'];

  @Field(() => Boolean)
  status: PharmacyStockClearanceDB['status'];

  @Field(() => Date)
  createdAt: PharmacyStockClearanceDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: PharmacyStockClearanceDB['updatedAt'] | null;
}
