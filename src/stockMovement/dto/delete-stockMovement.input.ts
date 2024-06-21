import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteStockMovementInput {
  @Field(() => String)
  id: string;
}
