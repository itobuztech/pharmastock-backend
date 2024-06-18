import { CreateWarehouseStockInput } from './create-warehouseStock.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWarehouseStockInput extends PartialType(
  CreateWarehouseStockInput,
) {
  @Field(() => String)
  id: string;
}
