import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  role: UserRole;

  @Field({ nullable: true })
  orgId: string;

  @Field({ nullable: true })
  confirmationToken: string;
}
