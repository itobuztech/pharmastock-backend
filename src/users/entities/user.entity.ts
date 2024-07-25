import { Field, ObjectType } from '@nestjs/graphql';
import {
  User as UserDB,
  Organization as OrganizationDB,
  Role as RoleDB,
} from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Organization } from '../../organization/entities/organization.entity';
import { Role } from './role.entity';

@ObjectType()
export class User {
  @Field(() => String)
  id: UserDB['id'];

  @Field(() => String)
  username: UserDB['username'];

  @Field(() => String)
  email: UserDB['email'];

  @Field(() => String, { nullable: true })
  name: UserDB['name'];

  @Exclude()
  password: UserDB['password'];

  @Field(() => Date)
  createdAt: UserDB['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: UserDB['updatedAt'] | null;

  @Field({ defaultValue: false })
  isEmailConfirmed: boolean;

  @Field({ nullable: true })
  emailConfirmationToken: string;

  @Field(() => Organization, { nullable: true })
  organization?: OrganizationDB;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
