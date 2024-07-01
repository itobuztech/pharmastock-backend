import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserDB } from '@prisma/client';
import { Exclude } from 'class-transformer';

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
}
