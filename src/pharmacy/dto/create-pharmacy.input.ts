import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePharmacyInput {
  @Field()
  name: string;

  @Field()
  location: string;

  @Field({ nullable: true })
  contactInfo?: string;
}
