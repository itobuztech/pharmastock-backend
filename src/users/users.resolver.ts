import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from './entities/user.entity';
import { UserRole } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { DeleteUserInput } from './dto/delete-user.input';
import { DeleteUserResponse } from './entities/delete-user-response.entity';
import { InviteUsersInput } from './dto/invite-user.input';

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
    @Context() ctx: any,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedUsers> {
    try {
      const user = ctx.req.user;

      return this.usersService.findAll(
        user,
        searchText,
        pagination,
        paginationArgs,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.USER_MANAGEMENT.CAPABILITIES.VIEW])
  findOne(@Args('email') email: string): Promise<User> {
    try {
      return this.usersService.findOne(email);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => User, { name: 'userById' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.USER_MANAGEMENT.CAPABILITIES.VIEW])
  findOneById(@Args('id') id: string): Promise<User> {
    try {
      return this.usersService.findOneById(id);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.USER_MANAGEMENT.CAPABILITIES.CREATE])
  create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    try {
      return this.usersService.create(createUserInput);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Mutation(() => DeleteUserResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async deleteUserBySuperAdmin(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ) {
    try {
      return await this.usersService.deleteUserBySuperAdmin(deleteUserInput);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Mutation(() => String, { name: 'inviteUsers' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async inviteUsers(
    @Context() ctx: any,
    @Args('inviteUsersInput') inviteUsersInput: InviteUsersInput,
  ) {
    try {
      const user = ctx.req.user;
      return await this.usersService.inviteUsers(user, inviteUsersInput);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
