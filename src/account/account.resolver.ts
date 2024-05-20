import { Resolver, Query, Context, Args, Mutation } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
//import { PermissionsGuardAND } from '../auth/guards/permissions-and.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { ResetPasswordInput } from './dto/reset-password.input';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) { }

  @Query(() => User, { name: 'account' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.PROFILE.CAPABILITIES.VIEW])
  findOne(@Context() ctx: any): Promise<User> {
    return this.accountService.findOne(ctx);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.PROFILE.CAPABILITIES.EDIT])
  resetPassword(@Context() ctx: any, @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput): Promise<Boolean> {
    return this.accountService.resetPassword(ctx, resetPasswordInput);
  }
}
