import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { User } from '../../users/entities/user.entity';

@ObjectType({})
export class AccountTypeResponse {
    @Field(() => String)
    role: UserRole;

    @Field(() => User)
    user: User;
}