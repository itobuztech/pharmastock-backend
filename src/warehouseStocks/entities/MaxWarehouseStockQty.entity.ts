import { Field, ObjectType } from '@nestjs/graphql';
import { WarehouseStock as WarehouseStockDB } from '@prisma/client';

@ObjectType()
export class MaxWarehouseStockQty {
  @Field(() => Number, { nullable: true, name: 'finalQty' })
  final_qty?: WarehouseStockDB['final_qty'];
}
