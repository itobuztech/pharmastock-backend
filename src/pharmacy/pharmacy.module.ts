import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyResolver } from './pharmacy.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [LoggerModule],
  providers: [
    PharmacyResolver,
    PharmacyService,
    PrismaService,
    AccountService,
    UsersService,
  ],
  exports: [PharmacyService, PrismaService],
})
export class PharmacyModule {}
