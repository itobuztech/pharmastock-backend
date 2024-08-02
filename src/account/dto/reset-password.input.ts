import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;

  @Field()
  confirmPassword: string;
}
