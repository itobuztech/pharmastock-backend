import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeletePharmacyStockInput {
  @Field(() => String)
  id: string;
}
