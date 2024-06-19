import { Field, ObjectType } from '@nestjs/graphql';
import { Pharmacy as PharmacyDB } from '@prisma/client';

@ObjectType()
export class Pharmacy {
  @Field(() => String)
  id: PharmacyDB['id'];

  @Field(() => String)
  name: PharmacyDB['name'];

  @Field(() => String)
  location: PharmacyDB['location'];

  @Field(() => String, { nullable: true })
  organizationId?: PharmacyDB['organizationId'];

  @Field(() => String, { nullable: true })
  contact_info?: PharmacyDB['contact_info'];

  @Field(() => Date)
  createdAt: PharmacyDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: PharmacyDB['updatedAt'] | null;
}
