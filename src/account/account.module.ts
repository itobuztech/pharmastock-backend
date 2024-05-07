import { Logger, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  providers: [AccountResolver, AccountService, PrismaService, Logger]
})
export class AccountModule { }
