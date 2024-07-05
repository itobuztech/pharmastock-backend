import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  active?: boolean;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  contact: string;
}
