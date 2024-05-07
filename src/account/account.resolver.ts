import { Resolver, Query, Context } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { PermissionsGuardAND } from '../auth/guards/permissions-and.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) { }

  @Query(() => User, { name: 'account' })
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuardAND)
  @Roles(UserRole.OWNER)
  @Permissions([PrivilegesList.PROFILE.CAPABILITIES.VIEW, PrivilegesList.PROFILE.CAPABILITIES.EDIT])
  findOne(@Context() ctx: any): Promise<User> {
    return this.accountService.findOne();
  }
}
