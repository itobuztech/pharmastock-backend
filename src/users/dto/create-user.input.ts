import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',  // The name by which the enum is referenced in GraphQL
  description: 'The roles available for a user',  // Optional description
});

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

  @Field((_type) => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  orgId: string;

  @Field({ nullable: true })
  confirmationToken: string;
}
