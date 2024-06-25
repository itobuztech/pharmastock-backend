import { CreateStockMovementInput } from './create-stockMovement.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStockMovementInput extends PartialType(
  CreateStockMovementInput,
) {
  @Field(() => String)
  id: string;
}
