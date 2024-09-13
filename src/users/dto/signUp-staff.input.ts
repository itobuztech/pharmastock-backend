import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpStaffInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  orgId: string;

  @Field({ nullable: true })
  confirmationToken: string;
}
