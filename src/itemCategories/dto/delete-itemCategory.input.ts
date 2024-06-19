import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteItemCategoryInput {
  @Field(() => String)
  id: string;
}
