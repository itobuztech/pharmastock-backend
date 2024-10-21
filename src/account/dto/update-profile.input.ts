import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field()
  username: string;

  @Field()
  name: string;
}
