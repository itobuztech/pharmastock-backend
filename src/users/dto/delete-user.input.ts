import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class DeleteUserInput {
  @Field(() => String)
  id: string;
}
