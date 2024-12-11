import { Field, ObjectType } from '@nestjs/graphql';
import {
  Pharmacy as PharmacyDB,
  Organization as OrganizationDB,
} from '@prisma/client';
import { Organization } from '../../organization/entities/organization.entity';
import { TotalCount } from 'src/pagination/toalCount.entity';

@ObjectType()
export class Pharmacy {
  @Field(() => String)
  id: PharmacyDB['id'];

  @Field(() => String)
  name: PharmacyDB['name'];

  @Field(() => String)
  location: PharmacyDB['location'];

  @Field(() => Organization, { nullable: true })
  organization?: OrganizationDB;

  @Field(() => String, { nullable: true, name: 'contactInfo' })
  contact_info?: PharmacyDB['contact_info'];

  @Field(() => Boolean)
  status: PharmacyDB['status'];

  @Field(() => Date)
  createdAt: PharmacyDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: PharmacyDB['updatedAt'] | null;
}

@ObjectType()
export class pharmaciesByOrganization {
  @Field(() => String)
  id: PharmacyDB['id'];

  @Field(() => String)
  name: PharmacyDB['name'];
}

// Define a new type for the paginated result
@ObjectType()
export class PaginatedPharmacies extends TotalCount {
  @Field(() => [Pharmacy])
  pharmacies: Pharmacy[];
}
