import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseResolver } from './warehouse.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [LoggerModule],
  providers: [
    WarehouseResolver,
    WarehouseService,
    PrismaService,
    AccountService,
    UsersService,
  ],
  exports: [WarehouseService, PrismaService],
})
export class WarehouseModule {}
