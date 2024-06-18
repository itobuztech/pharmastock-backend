import { Field, ObjectType } from '@nestjs/graphql';
import { Warehouse as WarehouseDB } from '@prisma/client';

@ObjectType()
export class Warehouse {
  @Field(() => String)
  id: WarehouseDB['id'];

  @Field(() => String)
  location: WarehouseDB['location'];

  @Field(() => String)
  area: WarehouseDB['area'];

  @Field(() => String, { nullable: true })
  organizationId?: WarehouseDB['organizationId'];

  @Field(() => String, { nullable: true })
  adminId?: WarehouseDB['adminId'];

  @Field(() => Date)
  createdAt: WarehouseDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: WarehouseDB['updatedAt'] | null;
}
