import { Field, ObjectType } from '@nestjs/graphql';
import {
  Warehouse as WarehouseDB,
  Organization as OrganizationDB,
  User as UserDB,
} from '@prisma/client';
import { Organization } from '../../organization/entities/organization.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Warehouse {
  @Field(() => String)
  id: WarehouseDB['id'];

  @Field(() => String)
  name: WarehouseDB['name'];

  @Field(() => String)
  location: WarehouseDB['location'];

  @Field(() => String)
  area: WarehouseDB['area'];

  @Field(() => Organization, { nullable: true })
  organization?: OrganizationDB;

  @Field(() => User, { nullable: true })
  admin?: UserDB;

  @Field(() => Boolean)
  status: WarehouseDB['status'];

  @Field(() => Date)
  createdAt: WarehouseDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: WarehouseDB['updatedAt'] | null;
}
