import { CreatePharmacyInput } from './create-pharmacy.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePharmacyInput extends PartialType(CreatePharmacyInput) {
  @Field(() => String)
  id: string;
}
