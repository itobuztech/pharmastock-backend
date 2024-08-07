import { Field, ObjectType } from '@nestjs/graphql';
import { WarehouseStock as WarehouseStockDB } from '@prisma/client';

@ObjectType()
export class MaxWarehouseStockQty {
  @Field(() => Number, { nullable: true })
  totalQty?: WarehouseStockDB['final_qty'];
}
