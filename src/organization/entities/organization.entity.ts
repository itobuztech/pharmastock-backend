import { Field, ObjectType } from '@nestjs/graphql';
import { Organization as OrganizationDB } from '@prisma/client';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Organization {
  @Field(() => String)
  id: OrganizationDB['id'];

  @Field(() => String)
  name: OrganizationDB['name'];

  @Field(() => String)
  description: OrganizationDB['description'];

  @Field(() => Boolean, { nullable: true })
  active: OrganizationDB['active'];

  @Field(() => String)
  address: OrganizationDB['address'];

  @Field(() => String)
  city: OrganizationDB['city'];

  @Field(() => String)
  country: OrganizationDB['country'];

  @Field(() => String)
  contact: OrganizationDB['contact'];

  @Field(() => Boolean)
  status: OrganizationDB['status'];

  @Field(() => Date)
  createdAt: OrganizationDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: OrganizationDB['updatedAt'] | null;

  @Field(() => [User], { nullable: true })
  User?: User;
}
