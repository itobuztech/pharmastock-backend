import { Logger, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [],
  providers: [
    AccountResolver,
    AccountService,
    PrismaService,
    Logger,
    UsersService,
    EmailService,
  ],
  exports: [AccountService],
})
export class AccountModule {}
