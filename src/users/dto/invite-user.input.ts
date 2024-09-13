import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

enum InviteUserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

registerEnumType(InviteUserRole, {
  name: 'inviteUserRole', // The name by which the enum is referenced in GraphQL
  description: 'The roles available for a user', // Optional description
});

@InputType()
export class InviteUsersInput {
  @Field({ nullable: true })
  organizationId: string;

  @Field()
  email: string;

  @Field(() => InviteUserRole)
  role: InviteUserRole;
}
