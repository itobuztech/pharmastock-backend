import { Field, ObjectType } from '@nestjs/graphql';
import { Role as RoleDB } from '@prisma/client';

@ObjectType()
export class Role {
  @Field(() => String)
  id?: RoleDB['id'];

  @Field(() => String)
  name?: RoleDB['name'];

  @Field(() => String)
  privileges?: RoleDB['privileges'];

  @Field(() => String)
  userType?: RoleDB['userType'];
}
