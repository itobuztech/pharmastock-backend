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
  roleId: string;

  @Field({ nullable: true })
  orgId: string;
}
