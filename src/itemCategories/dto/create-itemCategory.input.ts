import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemCategoryInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  parentCategoryId?: string;
}
