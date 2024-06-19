import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteWarehouseInput {
  @Field(() => String)
  id: string;
}
