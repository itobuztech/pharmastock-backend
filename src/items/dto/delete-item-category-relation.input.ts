import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteItemCategoryRelationInput {
  @Field(() => String)
  id: string;
}
