import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeletePharmacyInput {
  @Field(() => String)
  id: string;
}
