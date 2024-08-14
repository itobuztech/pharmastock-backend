import { Field, ObjectType } from '@nestjs/graphql';
import { Role as RoleDB } from '@prisma/client';

@ObjectType()
export class DeleteUserResponse {
  @Field(() => String)
  message: String;
}
