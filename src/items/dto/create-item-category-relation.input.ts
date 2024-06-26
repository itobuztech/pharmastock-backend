import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemCategoryRelationInput {
  @Field()
  itemCategoryId: string;

  @Field()
  itemId: string;
}
