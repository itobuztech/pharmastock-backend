import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class DeleteOrganizationInput {
  @Field(() => String)
  id: string;
}
