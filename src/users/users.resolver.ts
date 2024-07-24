import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from './entities/user.entity';
import { UserRole } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';

// Define a new type for the paginated result
@ObjectType()
class PaginatedUsers extends TotalCount {
  @Field(() => [User])
  users: User[];
}

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => PaginatedUsers, { name: 'users', nullable: true })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.USER_MANAGEMENT.CAPABILITIES.VIEW])
  findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedUsers> {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.USER_MANAGEMENT.CAPABILITIES.VIEW])
  findOne(@Args('email') email: string): Promise<User> {
    return this.usersService.findOne(email);
  }

  @Query(() => User, { name: 'userById' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.USER_MANAGEMENT.CAPABILITIES.VIEW])
  findOneById(@Args('id') id: string): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }
}
