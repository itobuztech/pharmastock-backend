import { CreateWarehouseInput } from './create-warehouse.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWarehouseInput extends PartialType(CreateWarehouseInput) {
  @Field(() => String)
  id: string;
}
