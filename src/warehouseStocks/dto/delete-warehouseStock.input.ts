import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteWarehouseStockInput {
  @Field(() => String)
  id: string;
}
