import { CreatePharmacyStockInput } from './create-pharmacyStock.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePharmacyStockInput extends PartialType(
  CreatePharmacyStockInput,
) {
  @Field(() => String)
  id: string;
}
