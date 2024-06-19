import { CreateItemCategoryInput } from './create-itemCategory.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemCategoryInput extends PartialType(
  CreateItemCategoryInput,
) {
  @Field(() => String)
  id: string;
}
